// ---------------------------------------------------------------------------
// Ask Me — realtime question inbox with no backend of our own.
//
// Transport: a public MQTT-over-WSS broker (EMQX). The browser connects
// directly; the broker only relays bytes and never stores anything we rely on.
//
// Privacy: the broker is a public relay, so every message body is encrypted
// end-to-end in the browser before it is published. Visitor questions are
// sealed with the owner's RSA-OAEP public key (hardcoded below); only the
// matching private key — which lives on the owner's own device, pasted once
// into the #/inbox page — can read them. Replies are sealed with a per-session
// AES-GCM key that is wrapped for the visitor's browser-generated public key,
// so only that visitor can read them. Anyone snooping on the broker sees
// ciphertext plus random 128-bit session ids, nothing else.
//
// Delivery model: nothing is stored on the broker. Each side keeps its own
// thread locally and re-publishes the whole thread as a batch every so often,
// so a side that was offline catches up the next time either page is open.
// ---------------------------------------------------------------------------

import mqtt from 'mqtt';

const BROKER = 'wss://broker.emqx.io:8084/mqtt';
const PREFIX = 'shashankworks.ask.v1';

export const TOPIC_LOBBY = `${PREFIX}/lobby`;
export const topicUp = (sid: string) => `${PREFIX}/${sid}/up`;
export const topicDown = (sid: string) => `${PREFIX}/${sid}/down`;

// Owner's RSA-OAEP public key (JWK, base64). The private half never leaves the
// owner's device — it is pasted once into the #/inbox page.
export const OWNER_PUB_B64 =
  'eyJrZXlfb3BzIjpbImVuY3J5cHQiXSwiZXh0Ijp0cnVlLCJhbGciOiJSU0EtT0FFUC0yNTYiLCJrdHkiOiJSU0EiLCJuIjoieHZRU0RRWUlTOWlqRG94Z1QtcXdTeUxJNGhDR1JuNmJ0X3RSa3BiOTVmX1o5V1FpS3YzLWZHRml5d1lONXBCUGlUbVc0bU1hdUF6OVJHd0VCV0NSLTk3NGw0dTZTNlFyREZScUM0WWtYZEQ2UVdaSFAyNEoyWEdpVS1GYzZ6TXA2VVhxNHBhUG1yUmpnNmdRendwcG5YX2E0UVNHUmdYcEMxTTI2MnlBRlFOYzVqWDdWNVN4alN1SHpJeGF2d0tSMUNNeFJLbUEtOFJndWVGeVBLdE0zdWE5cElvSFUzVXdtcGdDZm5DcnpHTF94bnAyWXU3MXhrMmJadlFGUWZlTmNMbzdYT1ZLNzZ4UXBselFPSmxrRTVteUpNVmMwTGxvUzh2a0JEM2xsblZDR0wwZWo0ejNHR3J2V0UzRTluQ1NsN1QtZ1I0aHRPZUREWkxFUkpOV0lRIiwiZSI6IkFRQUIifQ==';

// ---------- base64 helpers --------------------------------------------------

function bytesToB64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export const jsonToB64 = (obj: unknown) => bytesToB64(new TextEncoder().encode(JSON.stringify(obj)));
export const b64ToJson = <T,>(b64: string): T => JSON.parse(new TextDecoder().decode(b64ToBytes(b64))) as T;

// ---------- keys ------------------------------------------------------------

export type VisitorIdentity = {
  sid: string;        // random 128-bit conversation handle (safe to publish)
  pubB64: string;     // visitor's RSA public key (JWK, base64)
  privB64: string;    // visitor's RSA private key (JWK, base64) — browser-local only
};

const VISITOR_KEY = 'sv-ask-visitor-v1';

async function generateRsaPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['encrypt', 'decrypt'],
  );
}

async function exportJwk(key: CryptoKey): Promise<string> {
  return jsonToB64(await crypto.subtle.exportKey('jwk', key));
}

export async function importPub(jwkB64: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('jwk', b64ToJson<any>(jwkB64), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']);
}

export async function importPriv(jwkB64: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('jwk', b64ToJson<any>(jwkB64), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['decrypt']);
}

/** The visitor's identity: a fresh conversation id + keypair, kept in
 *  localStorage so returning visitors can still read old replies. */
export async function getVisitorIdentity(): Promise<VisitorIdentity> {
  const cached = localStorage.getItem(VISITOR_KEY);
  if (cached) {
    try {
      return JSON.parse(cached) as VisitorIdentity;
    } catch {
      /* fall through and mint a new one */
    }
  }
  const pair = await generateRsaPair();
  const identity: VisitorIdentity = {
    sid: crypto.randomUUID().replace(/-/g, ''),
    pubB64: await exportJwk(pair.publicKey),
    privB64: await exportJwk(pair.privateKey),
  };
  localStorage.setItem(VISITOR_KEY, JSON.stringify(identity));
  return identity;
}

const VISITOR_TOPIC = 'sv-ask-visitor';

/** The wire only starts counting a visitor after `pub(TOPIC_MESSAGES, ...)` is
 *  called with a fresh secret. That is the exact moment we mint a new
 *  conversation so old ones get a clean slide.
 *
 *  - resetVisitorIdentity(): a visitor clicks a fresh chat → the key is
 *    deleted, so the next message is treated as brand-new (no stale
 *    replies, no stale `env` payloads).
 *  - Closing the chat on the owner's side is the same move: the `closed`
 *    flag lives in `sv-ask-closed-<sid>` and the thread key, and the
 *    visitor gets `sv-ask-thread-<sid>` cleared when the new session starts.
 *
 *  - Resetting the key twice in a row is a no-op (same `sid`), so the
 *    visitor can restart freely without ever being re-connected to the
 *    previous conversation. */

export async function resetVisitorIdentity(): Promise<VisitorIdentity> {
  localStorage.removeItem(VISITOR_KEY);
  return getVisitorIdentity();
}

let ownerPubPromise: Promise<CryptoKey> | null = null;
export function getOwnerPub(): Promise<CryptoKey> {
  if (!ownerPubPromise) ownerPubPromise = importPub(OWNER_PUB_B64);
  return ownerPubPromise;
}

/** True only if `priv` is the private half of the public key baked into this
 *  build. Lets the inbox reject a wrong/stale/truncated key instead of sitting
 *  there "unlocking" and then silently decrypting nothing. */
export async function keyPairMatches(priv: CryptoKey): Promise<boolean> {
  try {
    const probe = await sealFor(await getOwnerPub(), 'probe');
    return (await openWith(priv, probe)) === 'probe';
  } catch {
    return false;
  }
}

// ---------- encryption ------------------------------------------------------

export type Cipher = { iv: string; ct: string; wr: string };

/** Seal `plain` with a fresh AES-GCM key, then wrap that key with `pub`
 *  (RSA-OAEP). Only the holder of the matching private key can open it. */
export async function sealFor(pub: CryptoKey, plain: string): Promise<Cipher> {
  const aes = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aes, new TextEncoder().encode(plain));
  const raw = await crypto.subtle.exportKey('raw', aes);
  const wr = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, pub, raw);
  return { iv: bytesToB64(iv), ct: bytesToB64(new Uint8Array(ct)), wr: bytesToB64(new Uint8Array(wr)) };
}

export async function openWith(priv: CryptoKey, c: Cipher): Promise<string> {
  const raw = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, priv, b64ToBytes(c.wr));
  const aes = await crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['decrypt']);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToBytes(c.iv) }, aes, b64ToBytes(c.ct));
  return new TextDecoder().decode(pt);
}

// ---------- wire format -----------------------------------------------------

export type AskMessage = {
  id: string;
  ts: number;
  text: string;
  mine: boolean;
  /** true once the other side has opened this message ("seen" tick) */
  seen?: boolean;
  /** when the other side's read receipt arrived */
  seenAt?: number;
};

/** One timezone for everybody — no "why does it say 3am?" confusion. */
export const TIME_ZONE = 'Asia/Kolkata';
export const TIME_ZONE_LABEL = 'IST';

export function formatTime(ts: number): string {
  if (!ts) return '';
  const time = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: TIME_ZONE,
  }).format(new Date(ts));
  return `${time.toUpperCase()} ${TIME_ZONE_LABEL}`;
}

/** One sealed message on the wire. `pub` (visitor's public key) rides along so
 *  the owner can seal replies back. */
export type AskEnvelope = { v: 1; sid: string; id: string; ts: number; c: Cipher; pub?: string };

export type AskWire =
  | { k: 'hello'; sid: string }
  | { k: 'env'; env: AskEnvelope }
  | { k: 'sync'; envs: AskEnvelope[] }
  /** read receipt: these message ids have been displayed on the other side */
  | { k: 'ack'; ids: string[] }
  /** the owner closed (or reopened) this conversation */
  | { k: 'closed'; open: boolean }
  /** the owner deleted these messages — drop them on this side too */
  | { k: 'del'; ids: string[] };

// ---------- broker connection (one shared client) ---------------------------

type WireHandler = (msg: AskWire) => void;

let client: mqtt.MqttClient | null = null;
const handlers = new Map<string, Set<WireHandler>>();

function ensureClient(): mqtt.MqttClient {
  if (client) return client;
  client = mqtt.connect(BROKER, {
    reconnectPeriod: 2000,
    connectTimeout: 8000,
    // The browser build ships a Node `ws` shim that throws; the native
    // WebSocket in the page is what we actually want.
    forceNativeWebSocket: true,
    // Random client id keeps the public broker from evicting us for a clash.
    clientId: `svask-${Math.random().toString(36).slice(2, 10)}`,
  } as mqtt.IClientOptions);
  client.on('message', (topic: string, payload: Uint8Array) => {
    let wire: AskWire;
    try {
      wire = JSON.parse(new TextDecoder().decode(payload)) as AskWire;
    } catch {
      return;
    }
    handlers.get(topic)?.forEach((fn) => fn(wire));
  });
  return client;
}

/** Subscribe to a topic; returns an unsubscribe function. */
export function sub(topic: string, fn: WireHandler): () => void {
  const c = ensureClient();
  let set = handlers.get(topic);
  if (!set) {
    set = new Set();
    handlers.set(topic, set);
    c.subscribe(topic, { qos: 0 });
  }
  set.add(fn);
  return () => {
    set!.delete(fn);
    if (set!.size === 0) {
      handlers.delete(topic);
      c.unsubscribe(topic);
    }
  };
}

export function pub(topic: string, wire: AskWire): void {
  ensureClient().publish(topic, JSON.stringify(wire), { qos: 0 });
}

export function isLive(): boolean {
  return Boolean(client && client.connected);
}

/** Fires (with the new live state) whenever the broker link changes. */
export function onLinkChange(fn: (live: boolean) => void): () => void {
  const c = ensureClient();
  const on = () => fn(true);
  const off = () => fn(false);
  c.on('connect', on);
  c.on('offline', off);
  return () => {
    c.off('connect', on);
    c.off('offline', off);
  };
}

// ---------- admin sign-in ---------------------------------------------------

export const ADMIN_USER = 'Shashank';

/** The owner's private key, wrapped with a key derived from the admin password
 *  (PBKDF2-SHA256 -> AES-GCM). Signing in unwraps it in the browser; the
 *  plaintext key is never part of the shipped bundle. */
const ADMIN_BLOB =
  'eyJ2IjoxLCJzYWx0IjoielRocDJ6Yk5kS1ZvcCtWWTNaalI0QT09IiwiaXYiOiJKUHRCYkpYOVpDZGNaTnBnIiwiY3QiOiJVUHFXZ3l0cmxMOXdra3drRUxiaW82NUZmNE5vNFV4eVlaeUYzeGxNMHlqeHVxaWpNQS9OSGRyTk9PZkp3eVNwdmJxMXlxU0FWTFk2THViYkdqWk9pSUhjSmlvQ0xuSDRycFlPd0JzRDE2MzVmMlBRc3hrbVhXRmNZbGNPK0s2ZU9ZQ3B5V21BSlc2WXVOcEJWYlVHZHV2T0JVdEhsUFZKUy9Bdis3NVJJMERuNDk2Wi8yd3RUNHBlNlNCZTd6M1NVQ3pOanNlZ2pEczVzVDEyYzdxVkpLcnBwbUJjZjVXMFhYR2hiN2FYL1N3RFdsSXdpSllHY1dtV1lkU1VVZ1VESk9XRC9OQnZLVnUrejE4N1dTTG9FTlVsSW1lS1JkcDN6dXJTamNFWW5mdi9BZFUwZ2ZuR1dCMHNHbzZncmluTEQ1cElpY2tFV3hzWHpCY0tKZTdYN2dhYWxUbUs2Y3VNMDh0Zm1wR2pjdzJ3QXJRT1lBNFk3V0w4VVE0QjF3VXpwS2ZmbVN5TWhCajM2TmtQTU9SeGU1OG5ndVZOUjhkeG5XdDlGUUllVGNGcHBVMXlSYVlXbDZjREY4VzVNNzNYd2d1dnQyK3FTMFRjUjZZODJsWE5sdWJ4UUd0a2h6b0FneDVaeTZ3R1JuL3NvRDNEeTFLN3ozWnpiV3BBNE1FcTdmOC84TFRyaVQ4YVJHSWdIL3dqcldVOXlzMGVScloveHNKWlUxNFk0UEJOMzE2K0hLK0NiOEJENThMN0ttUzRpbmhlMDRwYW4wQ05SYjFkaXB5bFBvQkxyT2kxSjJ6ZlF4MDhBOFBlaWg4Z1docmYyR0c3RnkwOUhUYzRQellhY09ZeGRHeURPbjFaR0dVSkphOWVuMkY4eGM3UVhUR2tUSk56TFYzeFp1TzRFZGhJcjlOcUFCSXd0Y2pRamhDZ1l0dTVpZXltTk92Sm01SXZseHFIUzVvOVBwNEp6VC9YMEFpN2srUXByRU9nL24xMzAzbEhTVmNZQmxRRWdMRUJ1c0d4a3o0QnBWdW5vTkZ4N0hFM0NaM3c3RkFCcFRuK0VCN0FvU1dwSGV3U2hkOSsycVJQRFkxVlFYbGRNMzI2cCs2NzlsUEZCUExGVXZUOEJ6WllKRUhnazlsS3R2SHZrYXNORzJ5NUh5dWlURFRGb3krTHpZY0ltN2NEWVpjM2xaZ29jcEcxNHFjRGI0UVV0eHVaMzVEcUVKN2ttNjlpbmo1OS9XMG5VWVhKMTJzaVRrSUNlWlVQaEJ3YXdpN0JRcmlQZFFzaTlsY1YrbitHUUwwQ0JmVm40Y2lPZy9xWFBLNmxCQzI1UmFlN0l2Y3BCSmVQbzF5Z3U3bEg2MUZwWnZvVy9pMUI0dnkzY3d5MkdPRzFYQXJ3NmVMVFBSM1hSamtlT0hVclVQaTByQ0paWFhhVmFwbVhlcmtXWTdXa1FTVGhhanlTbGM4a2Vucnl1U3FuQUFKZjdYOS9CckljOTdrZ2kvaXdJZ0lwa1lXcDE5Y1dlelFKQ3BpaFZOVVd1WVlyb0ZUbFFRNVg2TkY0R1BueTVJdEFQVTN1SGV5TjJMQmFEV0h1bjBWZCtyTnppTDNlOEx4Slgza0w4TlZteFZZN29uNkVYSGI0OVBjZEtINVZzSDlWR0JINFVLZHNnUmd6WXlHaDMxT0oyejBxZWJFOFBmK1FYMUNLUUw3VUI2U0orOHBHaTJrck5iSkQxVExLeDJpYW1GdStIcGFSMFd2N2JKT1dnelJ1VUdpbW51UndVcE5KY0pKNW1Gc1U5Zk0yWHdpSDY2Q01sS1dsZFF1YlFxc0hpMGtSVS9YL3NDclIxM2t1ZHZoeFR6K2xnVjZ3OFViaVpFUVpXclhxZW9NT1dkcTVBZzBLMFRXQmdpUUR0SUZ0MkJGSWkwM2ViQVMzWWJJK0l2UEdXVUpad2FHOVFBcXg4RmZ2M3MwN0NjMFBvblF1Zmh3L0hPeGtVU2hnK0JRU2tqT050SGVhV0cwK2g1WWYyRDJoVG5xU09pMDdJeUZiMnBEU3BLV2psb0kwOE85bDJ0MFc4SS9rZ2w5eFBmUHc2YnVTeDlMNCtCcU9VaXJDNlBhUVpaeGF2Uk9ZcGdsTUVsRTVvYUduNHhGZWdPYXYzM05FaDR5ZU5acDhLbmpNVHMzYzlqendENjAvYkpWb2t2UGJBdldQeFlYdy91UW1Hb3N1Z3lsS3FOTjlOWGU2eHJZSzMwZDluZi81TS9XaU4xeGhob3cvSDR4V043U1RJLy9LZU1NZEZYTk1lUC9Gd3BGd0JvQjQvb2lncDR2SURiQ1RmMWxlSmgrL05vaEVHOFlrcm9hYm01V0pvVHZjYlU2ckRCdXV4ZkcrZWx3L1RjU1NYdVpaN3FpU3d1VG9OeVpOaUM5K1FhUzcyNFpNUHV3VWROS3BIaXp1R0FrYWhCYUwvN1VKS05OVU9aenU4emNtb3J0YTVOd0RkT3ZRVTFtcklzTlZGKy9ETUp2alNEajQ2N0tUUGxmdDVVUEFNb2Jra2hzcWxIcUljWGdSVW10dW4zTEZLVnJHcU1nOFFQVytmd084WUgrcll6NUlDMHlBcDRJUWh5YmZJblVBTEszQ3dzTEl3MHIxeFpuNngwaXM3RXRMR1dTYkVRbmdNR28rZXFWTFlVS29qTGFPemQ2V3hTOHNOMVRQZFFWd2hBeStsNytNeDBJL1gzbDJhOWZtcnNLbEFHd1BrZ0dMa2lZVlhWRWN2YXdadDVScTk2VGhzdW9sYm9nSHp2emtENnlXOU5vdXlvTDZFSi9KdCtzZnJvRnpXMVNLeHZFUkVDeDRESGZkTkZ5QllqNWpEcWExZ1llMzVrVklkRDZXcllseWo3TzRuMjY5MFhKQnhhVHAwNENURDFBdFhkaWZxRU1VZ1lvU0g3ZDkwOU16MjlseCtqN0QydjMzUG5pSk1LcDJDT0VDMlVRMVluZUhnQzQ4Tk1nUlJTYU1XWXJpU0xOTlNWeWErSzhNYVJBaTl5Mjh0VkU1dFVtNjV4eG1kc1QxMkpRa2V4RkwvSUQzQWt0UFVsUCtoWWVJUHo2amNvNk5GQUlyRG4xT3FiZkpCcjdBMHJDZ05Tck54bGhvamMzN3hrY29MbmZlZFgxNy84ZkZORWpFSHRUSXJJVjBPMkNDMUJyV3VTNnp0VnJlbHJIUDNaV3dOUDdlVmVlaEZkdTlpQzNPaTUxNGxYOTBYUEljZ0ZrNStlREE0ZTQrUzJ0d2M2TFU2VkZYSExpRHYzYm5TTlI4QUViM1YxSFVnc3pkeGRLNHRJWEtOWWRMeWxrM3hnWXRhVTlTSG9zWkNFeHFCNDBKNk04VnZjM3hZVE55bENqa3E0RXRFVnZyRFNnSXluZ3Noa1d1a2J0SExOZHFEbXhUcHNRa1pJemRJMVE5RjhFUm9qL1dreURBSWhkU0tVaUdzT3V4MGxiNHJzL04vQ3hVRXk5N1JMcVgvNUFNTE51SU5Gb3h4SFR0QVI4US9aNy9SN0o2cVBnczNUNU9nb3RoQmhOWGh2dWxTYVU5RmFaVEg2bGpmS1F1SWRvMWF1Q2U5MFpINVdmK09YTzJjTTNUYmoycmp1T3padXEzbytwcVZ0YnhpSGZSZGFFVlNJNGtDRi9UREhKYWIzd0phR25WZ3hSbElldDdFVmsyMEpFNVcrT1dUcWcxTS9XVnhSdGxNeGRVVFpKajRGclJEVWluWGUzd2FKbWhIQ0ZNcHBlV1JDTk5XZHphYklPNHlQVUo4d1I2aXFXMUVxZkhKT243OUxrZGF4LzZTY3g5eE9iejB3ZXVEaGRDQTlTZlRJaTR4ME5UWVJEeW5sRThiZ0JXSERzL3ZFQ1JaVTZ3MFBZWDdncU50Zmtza01jalRReld0OUZCS2s4VG1EUDd1TldWTVVZaCtHQVNxQm10VEw3ZTlYYS8vQzJtZVh2Ykh2dElOdEZXNGVwSVdQZGw3dHBQIn0=';

const ADMIN_ITERATIONS = 300000;

export async function signIn(user: string, password: string): Promise<CryptoKey | null> {
  if (user.trim() !== ADMIN_USER || !password) return null;
  try {
    const wrapped = JSON.parse(new TextDecoder().decode(b64ToBytes(ADMIN_BLOB))) as {
      salt: string;
      iv: string;
      ct: string;
    };
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
      'deriveKey',
    ]);
    const aes = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: b64ToBytes(wrapped.salt), iterations: ADMIN_ITERATIONS, hash: 'SHA-256' },
      base,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    );
    const plain = new TextDecoder().decode(
      await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToBytes(wrapped.iv) }, aes, b64ToBytes(wrapped.ct)),
    );
    const key = await importPriv(plain);
    return (await keyPairMatches(key)) ? key : null;
  } catch {
    return null;
  }
}

// ---------- notifications ---------------------------------------------------

/** A short two-tone chime so a new message is noticeable without looking. */
export function playChime(): void {
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx: AudioContext = new Ctx();
    const now = ctx.currentTime;
    [880, 1318.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now + i * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.25, now + i * 0.14 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.14 + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.14);
      osc.stop(now + i * 0.14 + 0.24);
    });
    setTimeout(() => ctx.close?.(), 1200);
  } catch {
    /* audio is a nicety, never a blocker */
  }
}

export async function requestNotifications(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

/** Desktop notification + chime, silently degrading to chime-only (e.g. when
 *  the page is embedded in an iframe that blocks the Notification API). */
export function announce(title: string, body: string): void {
  playChime();
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: undefined });
    }
  } catch {
    /* iframe or blocked permission — the in-page thread still updates */
  }
}
