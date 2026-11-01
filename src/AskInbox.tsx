// ---------------------------------------------------------------------------
// Owner inbox — the private half of "Ask Me Anything", at the #/inbox route.
//
// Locked by the owner's RSA private key: paste it once on a device and it is
// kept in that browser's localStorage only. Without the key the page is
// useless — every question on the wire is sealed for that key alone. Visitors
// who stumble on #/inbox see a locked screen and nothing else.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type AskEnvelope,
  type AskMessage,
  type AskWire,
  announce,
  formatTime,
  importPriv,
  importPub,
  jsonToB64,
  keyPairMatches,
  signIn,
  isLive,
  onLinkChange,
  openWith,
  pub,
  sealFor,
  sub,
  TOPIC_LOBBY,
  topicDown,
  topicUp,
} from './askChat';

const OWNER_PRIV_KEY = 'sv-ask-owner-priv-v1';
const OWNER_SESSIONS = 'sv-ask-owner-sessions-v1';
const ownerThreadKey = (sid: string) => `sv-ask-inbox-${sid}`;
const ownerOutKey = (sid: string) => `sv-ask-replies-${sid}`;
const SYNC_MS = 15_000;

type SessionState = {
  sid: string;
  name?: string;
  msgs: AskMessage[];
  lastTs: number;
  pub?: string;
  /** messages we received but could not open with the loaded key */
  bad?: number;
};

/** The key file ships with a few explanatory comment lines, and chat/email
 *  copies pick up line breaks — keep only the long base64 token. */
const cleanKey = (raw: string): string => {
  const tokens = raw.split(/\s+/).filter((t) => /^[A-Za-z0-9+/=]+$/.test(t) && t.length > 100);
  tokens.sort((a, b) => b.length - a.length);
  return tokens[0] ?? '';
};

const lastOf = <T,>(arr: T[]): T | undefined => (arr.length ? arr[arr.length - 1] : undefined);

const readKnownSids = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(OWNER_SESSIONS) ?? '[]') as string[];
  } catch {
    return [];
  }
};

const rememberSid = (sid: string) => {
  const sids = new Set(readKnownSids());
  sids.add(sid);
  localStorage.setItem(OWNER_SESSIONS, JSON.stringify([...sids]));
};

const loadThread = (sid: string): AskMessage[] => {
  try {
    return JSON.parse(localStorage.getItem(ownerThreadKey(sid)) ?? '[]') as AskMessage[];
  } catch {
    return [];
  }
};

/** Replies we sent, kept as sealed envelopes so they can be re-published to a
 *  visitor who was offline when we wrote them (even across inbox reloads). */
const loadReplies = (sid: string): AskEnvelope[] => {
  try {
    return JSON.parse(localStorage.getItem(ownerOutKey(sid)) ?? '[]') as AskEnvelope[];
  } catch {
    return [];
  }
};

const hiddenKey = (sid: string) => `sv-ask-inbox-hidden-${sid}`;
const BLOCKED_KEY = 'sv-ask-blocked';
const SEEN_ON_KEY = 'sv-ask-seen-on';

/** Conversations the owner closed — they are gone from the inbox and must not
 *  be recreated when that visitor's page announces itself again. */
const loadBlocked = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(BLOCKED_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
};

const addBlocked = (sid: string): void => {
  localStorage.setItem(BLOCKED_KEY, JSON.stringify([...new Set([...loadBlocked(), sid])]));
};

/** Message ids the owner deleted for their own view; they stay on the wire, so
 *  remember them and filter them out when the visitor re-syncs. */
const loadHidden = (sid: string): string[] => {
  try {
    return JSON.parse(localStorage.getItem(hiddenKey(sid)) ?? '[]') as string[];
  } catch {
    return [];
  }
};

const rememberHidden = (sid: string, id: string): void => {
  const set = new Set(loadHidden(sid));
  set.add(id);
  localStorage.setItem(hiddenKey(sid), JSON.stringify([...set].slice(-500)));
};

const inboxAckKey = (sid: string) => `sv-ask-inbox-acks-${sid}`;

const loadInboxAcks = (sid: string): string[] => {
  try {
    return JSON.parse(localStorage.getItem(inboxAckKey(sid)) ?? '[]') as string[];
  } catch {
    return [];
  }
};

const rememberInboxAcks = (sid: string, ids: string[]): string[] => {
  const set = new Set(loadInboxAcks(sid));
  for (const id of ids) set.add(id);
  const next = [...set].slice(-400);
  localStorage.setItem(inboxAckKey(sid), JSON.stringify(next));
  return next;
};

const rememberReply = (sid: string, env: AskEnvelope) => {
  const list = loadReplies(sid);
  if (list.some((e) => e.id === env.id)) return;
  list.push(env);
  localStorage.setItem(ownerOutKey(sid), JSON.stringify(list.slice(-200)));
};

export default function AskInbox() {
  const [privB64, setPrivB64] = useState<string>(() => localStorage.getItem(OWNER_PRIV_KEY) ?? '');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [sessions, setSessions] = useState<Record<string, SessionState>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [live, setLive] = useState(isLive());
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState(() => document.visibilityState !== 'hidden');
  // Inline two-step confirmations (window.confirm is blocked in sandboxed frames).
  const [confirmClose, setConfirmClose] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  /** "Step out" mode: no conversation is open, so nothing gets marked seen. */
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  /** Read receipts can be paused: read freely, tell the visitor later. */
  const [seenOn, setSeenOn] = useState(() => localStorage.getItem(SEEN_ON_KEY) !== '0');
  const seenOnRef = useRef(seenOn);
  /** receipts waiting for seen to be switched back on */
  const pendingAcksRef = useRef<Map<string, string[]>>(new Map());
  const threadRef = useRef<HTMLDivElement | null>(null);
  /** Auto-scroll only while the owner is already at the bottom of the thread. */
  const stickRef = useRef(true);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    seenOnRef.current = seenOn;
  }, [seenOn]);

  // Fresh conversation -> start at the newest message.
  useEffect(() => {
    stickRef.current = true;
  }, [selected]);

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    const onScroll = () => {
      stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [selected, unlocked]);

  useEffect(() => {
    const el = threadRef.current;
    if (!el || !stickRef.current) return;
    if (document.visibilityState !== 'visible') return;
    el.scrollTop = el.scrollHeight;
  }, [selected, sessions, unlocked]);

  const privKey = useRef<CryptoKey | null>(null);
  const sessionsRef = useRef<Record<string, SessionState>>({});
  const downEnvelopes = useRef<Map<string, Map<string, AskEnvelope>>>(new Map());
  const subsRef = useRef<Map<string, () => void>>(new Map());
  const acksRef = useRef<Map<string, string[]>>(new Map());

  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  const accept = useCallback((key: CryptoKey) => {
    privKey.current = key;
    setUnlocked(true);
    setError('');
  }, []);

  const handleSignIn = useCallback(async () => {
    if (signingIn) return;
    setSigningIn(true);
    setError('');
    try {
      const key = await signIn(user, password);
      if (!key) {
        setError('Wrong username or password.');
        return;
      }
      // Remember this device so a refresh doesn't ask again.
      localStorage.setItem(OWNER_PRIV_KEY, jsonToB64(await crypto.subtle.exportKey('jwk', key)));
      setPassword('');
      accept(key);
    } catch {
      setError('Sign in failed — try again.');
    } finally {
      setSigningIn(false);
    }
  }, [accept, password, signingIn, user]);

  const signOut = useCallback(() => {
    localStorage.removeItem(OWNER_PRIV_KEY);
    privKey.current = null;
    setUnlocked(false);
    setSessions({});
    setSelected(null);
  }, []);

  // A returning owner on this device lands straight in.
  useEffect(() => {
    if (!privB64) return;
    importPriv(cleanKey(privB64))
      .then(async (key) => (await keyPairMatches(key)) ? key : Promise.reject(new Error('mismatch')))
      .then(accept)
      .catch(() => {
        localStorage.removeItem(OWNER_PRIV_KEY);
        setPrivB64('');
      });
  }, [privB64, accept]);

  useEffect(() => onLinkChange(setLive), []);

  const mergeIntoSession = useCallback((sid: string, envs: AskEnvelope[]) => {
    void (async () => {
      if (!privKey.current) return;
      const opened: { msg: AskMessage; name?: string }[] = [];
      const hidden = new Set(loadHidden(sid));
      let bad = 0;
      for (const env of envs) {
        if (hidden.has(env.id)) continue; // deleted for my view only
        try {
          // openWith() already returns the plaintext JSON string.
          const body = JSON.parse(await openWith(privKey.current, env.c)) as { text: string; name?: string };
          opened.push({ msg: { id: env.id, ts: env.ts, text: body.text, mine: false }, name: body.name });
        } catch {
          bad += 1; /* sealed for another key */
        }
      }
      if (!opened.length) {
        if (bad) {
          setSessions((prev) =>
            prev[sid] ? { ...prev, [sid]: { ...prev[sid], bad: Math.max(prev[sid].bad ?? 0, bad) } } : prev,
          );
        }
        return;
      }
      setSessions((prev) => {
        const current = prev[sid] ?? { sid, msgs: [], lastTs: 0 };
        const byId = new Map(current.msgs.map((m) => [m.id, m]));
        let added = 0;
        for (const { msg } of opened) {
          if (!byId.has(msg.id)) {
            byId.set(msg.id, msg);
            added += 1;
          }
        }
        if (!added) return prev;
        const msgs = [...byId.values()].sort((a, b) => a.ts - b.ts);
        localStorage.setItem(ownerThreadKey(sid), JSON.stringify(msgs));
        return {
          ...prev,
          [sid]: {
            ...current,
            name: current.name ?? opened.find((o) => o.name)?.name,
            pub: envs.find((e) => e.pub)?.pub ?? current.pub,
            msgs,
            bad: bad || current.bad,
            lastTs: Math.max(current.lastTs, ...msgs.map((m) => m.ts)),
          },
        };
      });
      // If nothing useful is open, jump to the conversation that just spoke —
      // unless the owner deliberately stepped out of every chat.
      if (!pausedRef.current) {
        setSelected((cur) => {
          const curMsgs = cur ? (sessionsRef.current[cur]?.msgs ?? []) : [];
          return cur && curMsgs.length ? cur : sid;
        });
      }
      const known = new Set((sessionsRef.current[sid]?.msgs ?? []).map((m) => m.id));
      const fresh = opened.filter((o) => !known.has(o.msg.id));
      if (fresh.length) {
        rememberSid(sid);
        announce('New question', fresh[fresh.length - 1].msg.text);
      }
    })();
  }, []);

  /** The visitor saw the replies listed in `ids`. */
  const markSeen = useCallback((sid: string, ids: string[]) => {
    const set = new Set(ids);
    setSessions((prev) => {
      const current = prev[sid];
      if (!current) return prev;
      let changed = false;
      const msgs = current.msgs.map((m) => {
        if (m.mine && !m.seen && set.has(m.id)) {
          changed = true;
          return { ...m, seen: true, seenAt: Date.now() };
        }
        return m;
      });
      if (!changed) return prev;
      localStorage.setItem(ownerThreadKey(sid), JSON.stringify(msgs));
      return { ...prev, [sid]: { ...current, msgs } };
    });
  }, []);

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  /** Hand every queued receipt to its visitor right now. */
  const flushAcks = useCallback(() => {
    for (const [sid, ids] of pendingAcksRef.current) {
      const remembered = rememberInboxAcks(sid, ids);
      acksRef.current.set(sid, remembered);
      pub(topicDown(sid), { k: 'ack', ids: remembered });
    }
    pendingAcksRef.current.clear();
  }, []);

  const toggleSeen = useCallback(() => {
    const next = !seenOnRef.current;
    seenOnRef.current = next;
    setSeenOn(next);
    localStorage.setItem(SEEN_ON_KEY, next ? '1' : '0');
    if (next) flushAcks();
  }, [flushAcks]);

  // Wire everything up once the key is in.
  useEffect(() => {
    if (!unlocked) return;

    const ensureSubscribed = (sid: string) => {
      if (subsRef.current.has(sid)) return;
      // Re-load earlier replies so the sync loop can hand them to this visitor.
      if (!downEnvelopes.current.has(sid)) {
        const stored = loadReplies(sid);
        if (stored.length) downEnvelopes.current.set(sid, new Map(stored.map((e) => [e.id, e])));
      }
      if (!acksRef.current.has(sid)) acksRef.current.set(sid, loadInboxAcks(sid));
      const unsub = sub(topicUp(sid), (wire: AskWire) => {
        if (wire.k === 'ack') {
          markSeen(sid, wire.ids);
          return;
        }
        const envs = wire.k === 'sync' ? wire.envs : wire.k === 'env' ? [wire.env] : [];
        if (envs.length) mergeIntoSession(sid, envs);
      });
      subsRef.current.set(sid, unsub);
    };

    // Restore known conversations and their local history.
    const restored: Record<string, SessionState> = {};
    const blocked = new Set(loadBlocked());
    for (const sid of readKnownSids()) {
      if (blocked.has(sid)) continue;
      const hidden = new Set(loadHidden(sid));
      const msgs = loadThread(sid).filter((m) => !hidden.has(m.id));
      restored[sid] = { sid, msgs, lastTs: lastOf(msgs)?.ts ?? 0 };
      ensureSubscribed(sid);
    }
    setSessions((prev) => ({ ...restored, ...prev }));
    setSelected((cur) => cur ?? Object.keys(restored)[0] ?? null);

    // Live arrivals: new visitors announce themselves in the lobby.
    const unsubLobby = sub(TOPIC_LOBBY, (wire: AskWire) => {
      if (wire.k !== 'hello') return;
      // A closed conversation must stay closed: remind that visitor and ignore.
      if (loadBlocked().includes(wire.sid)) {
        pub(topicDown(wire.sid), { k: 'closed', open: false });
        return;
      }
      rememberSid(wire.sid);
      ensureSubscribed(wire.sid);
      setSelected((cur) => cur ?? wire.sid);
      setSessions((prev) => prev[wire.sid] ? prev : { ...prev, [wire.sid]: { sid: wire.sid, msgs: [], lastTs: 0 } });
    });

    // Keep republishing our replies so visitors who were offline catch up, and
    // repeat our read receipts in case one was dropped.
    const syncTimer = window.setInterval(() => {
      for (const [sid, envs] of downEnvelopes.current) {
        if (envs.size) pub(topicDown(sid), { k: 'sync', envs: [...envs.values()] });
      }
      for (const [sid, ids] of acksRef.current) {
        if (ids.length) pub(topicDown(sid), { k: 'ack', ids });
      }
      // Queued receipts never wait longer than one sync tick.
      if (seenOnRef.current && pendingAcksRef.current.size) flushAcks();
    }, SYNC_MS);

    return () => {
      unsubLobby();
      window.clearInterval(syncTimer);
      subsRef.current.forEach((unsub) => unsub());
      subsRef.current.clear();
    };
  }, [unlocked, mergeIntoSession, markSeen, flushAcks]);

  // Whatever is open on screen counts as read: mark it locally (so the unread
  // counters drop) and tell the visitor. Skipped entirely while stepped out.
  useEffect(() => {
    if (!unlocked || !selected || !visible || paused) return;
    const open = sessions[selected];
    if (!open) return;
    const ids = open.msgs.filter((m) => !m.mine).map((m) => m.id);
    if (!ids.length) return;

    const unread = new Set(open.msgs.filter((m) => !m.mine && !m.seen).map((m) => m.id));
    if (unread.size) {
      setSessions((prev) => {
        const current = prev[selected];
        if (!current) return prev;
        const msgs = current.msgs.map((m) => (unread.has(m.id) ? { ...m, seen: true } : m));
        localStorage.setItem(ownerThreadKey(selected), JSON.stringify(msgs));
        return { ...prev, [selected]: { ...current, msgs } };
      });
    }

    if (!seenOnRef.current) {
      // Read locally, but keep the receipt until seen is switched back on.
      const queued = pendingAcksRef.current.get(selected) ?? [];
      pendingAcksRef.current.set(selected, [...new Set([...queued, ...ids])]);
      return;
    }

    const remembered = rememberInboxAcks(selected, ids);
    acksRef.current.set(selected, remembered);
    pub(topicDown(selected), { k: 'ack', ids: remembered });
  }, [unlocked, selected, visible, sessions, paused]);


  /** Close a chat: tell the visitor, then wipe every local trace of it. */
  const closeChat = useCallback((sid: string) => {
    // Repeat the signal a few times — QoS 0 can drop a lone publish.
    pub(topicDown(sid), { k: 'closed', open: false });
    window.setTimeout(() => pub(topicDown(sid), { k: 'closed', open: false }), 400);
    window.setTimeout(() => pub(topicDown(sid), { k: 'closed', open: false }), 1200);

    addBlocked(sid);
    for (const key of [ownerThreadKey(sid), ownerOutKey(sid), inboxAckKey(sid), hiddenKey(sid)]) {
      localStorage.removeItem(key);
    }
    localStorage.setItem(OWNER_SESSIONS, JSON.stringify(readKnownSids().filter((s) => s !== sid)));

    subsRef.current.get(sid)?.();
    subsRef.current.delete(sid);
    downEnvelopes.current.delete(sid);
    acksRef.current.delete(sid);

    setSessions((prev) => {
      const next = { ...prev };
      delete next[sid];
      return next;
    });
  }, []);

  /** Delete one message on both sides (the visitor's copy goes too). */
  const deleteMessage = useCallback((sid: string, id: string) => {
    rememberHidden(sid, id);
    downEnvelopes.current.get(sid)?.delete(id);
    localStorage.setItem(ownerOutKey(sid), JSON.stringify(loadReplies(sid).filter((e) => e.id !== id)));
    pub(topicDown(sid), { k: 'del', ids: [id] });
    setSessions((prev) => {
      const current = prev[sid];
      if (!current) return prev;
      const msgs = current.msgs.filter((m) => m.id !== id);
      localStorage.setItem(ownerThreadKey(sid), JSON.stringify(msgs));
      return { ...prev, [sid]: { ...current, msgs } };
    });
  }, []);

  // Keep a conversation open even after one is closed/removed — but never
  // re-enter a chat while the owner has stepped out.
  useEffect(() => {
    if (!unlocked || paused) return;
    if (selected && sessions[selected]) return;
    const first = Object.values(sessions).sort((a, b) => b.lastTs - a.lastTs)[0];
    setSelected(first ? first.sid : null);
  }, [unlocked, selected, sessions, paused]);

  const reply = useCallback(async () => {
    const text = draft.trim();
    const sid = selected;
    if (!text || !sid) return;
    const pubJwk = sessions[sid]?.pub;
    if (!pubJwk) return;
    setSaving(true);
    try {
      const visitorPub = await importPub(pubJwk);
      const sealed = await sealFor(visitorPub, JSON.stringify({ text }));
      const env: AskEnvelope = { v: 1, sid, id: crypto.randomUUID(), ts: Date.now(), c: sealed };
      if (!downEnvelopes.current.has(sid)) downEnvelopes.current.set(sid, new Map());
      downEnvelopes.current.get(sid)!.set(env.id, env);
      rememberReply(sid, env);
      pub(topicDown(sid), { k: 'env', env });
      stickRef.current = true; // my own reply always scrolls into view
      setSessions((prev) => {
        const current = prev[sid];
        if (!current) return prev;
        const msgs = [...current.msgs, { id: env.id, ts: env.ts, text, mine: true }].sort((a, b) => a.ts - b.ts);
        localStorage.setItem(ownerThreadKey(sid), JSON.stringify(msgs));
        return { ...prev, [sid]: { ...current, msgs, lastTs: env.ts } };
      });
      setDraft('');
    } finally {
      setSaving(false);
    }
  }, [draft, selected, sessions]);

  // ---------- sign-in screen -------------------------------------------------
  if (!unlocked) {
    return (
      <div className="inbox-lock">
        <h1 className="inbox-lock-title">Owner Inbox</h1>
        <p className="inbox-lock-text">
          Sign in to read your messages from any device — no key to copy around. Only this browser remembers you until
          you sign out.
        </p>
        <form
          className="inbox-signin"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSignIn();
          }}
        >
          <input
            className="inbox-field"
            type="text"
            placeholder="Username"
            autoComplete="username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            className="inbox-field"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="inbox-error">{error}</p>}
          <button type="submit" className="ask-send" disabled={!user.trim() || !password || signingIn}>
            {signingIn ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    );
  }

  // ---------- unlocked inbox -------------------------------------------------
  const list = Object.values(sessions).sort((a, b) => b.lastTs - a.lastTs);
  const current = selected ? sessions[selected] : undefined;
  const unreadOf = (s: SessionState) => s.msgs.filter((m) => !m.mine && !m.seen).length;
  const totalUnread = list.reduce((n, s) => n + unreadOf(s), 0);
  const peopleUnread = list.filter((s) => unreadOf(s) > 0).length;

  return (
    <div className="inbox">
      <header className="inbox-head">
        <h1 className="inbox-title">Owner Inbox</h1>
        <span className={`ask-live${live ? ' is-live' : ''}`}>
          <span className="ask-live-dot" aria-hidden="true" />
          {live ? 'Live' : 'Offline'}
        </span>
        <button
          type="button"
          className={`inbox-btn${seenOn ? ' is-on' : ' is-off'}`}
          onClick={toggleSeen}
          title={
            seenOn
              ? 'Read receipts are live. Click to read without telling the visitor.'
              : 'Read receipts are paused — the visitor is not told. Click to send them.'
          }
        >
          {seenOn ? 'Seen: ON' : 'Seen: OFF'}
        </button>
        <button
          type="button"
          className={`inbox-btn${paused ? ' is-reopen' : ''}`}
          onClick={() => {
            if (paused) {
              setPaused(false);
              return;
            }
            setPaused(true);
            setSelected(null);
          }}
          title={
            paused
              ? 'Back to reading — new messages will be marked seen again'
              : "Step out of every chat so nothing is marked seen while you're away"
          }
        >
          {paused ? 'Resume reading' : 'Step out'}
        </button>
        <button type="button" className="inbox-btn inbox-signout" onClick={signOut}>
          Sign out
        </button>
        {totalUnread > 0 && (
          <span className="inbox-badge" title="Unread messages and the people they came from">
            {totalUnread} new · {peopleUnread} {peopleUnread === 1 ? 'person' : 'people'}
          </span>
        )}
      </header>

      <div className="inbox-body">
        <aside className="inbox-list" aria-label="Conversations">
          {list.length === 0 && <p className="inbox-empty">Waiting for questions… keep this tab open.</p>}
          {list.map((s) => (
            <button
              key={s.sid}
              type="button"
              className={`inbox-item${s.sid === selected ? ' is-active' : ''}`}
              onClick={() => {
                setPaused(false);
                setSelected(s.sid);
              }}
            >
              <span className="inbox-item-top">
                <span className="inbox-item-name">
                  {s.name ? (
                    <>
                      {s.name.split(' #')[0]}
                      <span className="inbox-tag">#{s.name.split(' #')[1] ?? s.sid.slice(0, 4)}</span>
                    </>
                  ) : (
                    `Visitor ${s.sid.slice(0, 4)}`
                  )}
                </span>
                {unreadOf(s) > 0 && <span className="inbox-item-badge">{unreadOf(s)}</span>}
              </span>
              <span className="inbox-item-preview">{lastOf(s.msgs)?.text ?? '…'}</span>
            </button>
          ))}
        </aside>

        <section className="inbox-thread">
          {!current ? (
            <div className="inbox-away">
              <span className="inbox-away-title">You&apos;re not in any chat</span>
              <p className="inbox-away-text">
                Nothing will be marked seen while you&apos;re stepped out — new messages just pile up as unread. Pick a
                conversation on the left (or hit Resume reading) whenever you&apos;re ready.
              </p>
            </div>
          ) : (
            <>
              <div className="inbox-thread-head">
                <span className="inbox-thread-name">
                  {current.name ? (
                    <>
                      {current.name.split(' #')[0]}
                      <span className="inbox-tag">#{current.name.split(' #')[1] ?? current.sid.slice(0, 4)}</span>
                    </>
                  ) : (
                    `Visitor ${current.sid.slice(0, 4)}`
                  )}
                </span>
                <button
                  type="button"
                  className={`inbox-btn${confirmClose === current.sid ? ' is-confirming' : ''}`}
                  onClick={() => {
                    if (confirmClose === current.sid) {
                      closeChat(current.sid);
                      setConfirmClose(null);
                      return;
                    }
                    setConfirmClose(current.sid);
                    window.setTimeout(() => setConfirmClose((c) => (c === current.sid ? null : c)), 4500);
                  }}
                  title="End this chat and remove it — the visitor can start a fresh one"
                >
                  {confirmClose === current.sid ? 'Confirm — delete chat?' : 'Close chat'}
                </button>
              </div>
              <div className="ask-thread inbox-messages" role="log" ref={threadRef}>
                {(current.bad ?? 0) > 0 && (
                  <p className="inbox-warn">
                    {current.bad} message{current.bad === 1 ? '' : 's'} arrived but could not be decrypted — this
                    conversation was sealed for a different key.
                  </p>
                )}
                {current.msgs.map((m) => (
                  <div key={m.id} className={`ask-bubble${m.mine ? ' ask-bubble--mine' : ' ask-bubble--them'}`}>
                    <button
                      type="button"
                      className={`ask-bubble-del${confirmDel === m.id ? ' is-confirming' : ''}`}
                      title="Delete this message for both of you"
                      aria-label="Delete message for both sides"
                      onClick={() => {
                        if (confirmDel === m.id) {
                          deleteMessage(current.sid, m.id);
                          setConfirmDel(null);
                          return;
                        }
                        setConfirmDel(m.id);
                        window.setTimeout(() => setConfirmDel((c) => (c === m.id ? null : c)), 4500);
                      }}
                    >
                      {confirmDel === m.id ? 'Delete?' : '×'}
                    </button>
                    <p className="ask-bubble-text">{m.text}</p>
                    <span className="ask-bubble-time">
                      <span className="ask-time">{formatTime(m.ts)}</span>
                      {m.mine && m.seen && (
                        <span className="ask-seen">Seen{m.seenAt ? ` · ${formatTime(m.seenAt)}` : ''}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="ask-composer">
                <textarea
                  className="ask-input"
                  placeholder="Type your reply…"
                  value={draft}
                  rows={2}
                  maxLength={800}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void reply();
                    }
                  }}
                />
                <div className="ask-actions">
                  <span className="inbox-hint">
                    {current.pub ? 'Replies reach them while their page is open.' : 'Waiting for their first message…'}
                  </span>
                  <button type="button" className="ask-send" onClick={() => void reply()} disabled={!draft.trim() || saving}>
                    {saving ? 'Sending…' : 'Reply'}
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
