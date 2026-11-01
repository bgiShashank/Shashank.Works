// ---------------------------------------------------------------------------
// "Ask Me Anything" — the visitor-facing half of the private inbox.
//
// A visitor types a question; it is sealed with the owner's public key and
// published to their own random conversation topic. The owner's #/inbox page
// (and only it, since it holds the private key) can open it and reply. Replies
// come back sealed for this browser's key and chime + pop a notification.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  type AskEnvelope,
  type AskMessage,
  type AskWire,
  type VisitorIdentity,
  announce,
  formatTime,
  getOwnerPub,
  getVisitorIdentity,
  importPriv,
  resetVisitorIdentity,
  isLive,
  onLinkChange,
  openWith,
  pub,
  requestNotifications,
  sealFor,
  sub,
  TOPIC_LOBBY,
  topicDown,
  topicUp,
} from './askChat';

const threadKey = (sid: string) => `sv-ask-thread-${sid}`;
const outKey = (sid: string) => `sv-ask-out-${sid}`;
const nameKey = (sid: string) => `sv-ask-name-${sid}`;
const ackKey = (sid: string) => `sv-ask-acks-${sid}`;
const closedKey = (sid: string) => `sv-ask-closed-${sid}`;
const delKey = (sid: string) => `sv-ask-del-${sid}`;

/** Ids the owner deleted — they must not come back from an old sync. */
const loadDeleted = (sid: string): string[] => {
  try {
    return JSON.parse(localStorage.getItem(delKey(sid)) ?? '[]') as string[];
  } catch {
    return [];
  }
};

/** Ids of the other side's messages we have already displayed, so we can keep
 *  telling them "seen" (ack) without spamming on every render. */
const loadAcks = (sid: string): string[] => {
  try {
    return JSON.parse(localStorage.getItem(ackKey(sid)) ?? '[]') as string[];
  } catch {
    return [];
  }
};

const rememberAcks = (sid: string, ids: string[]): string[] => {
  const set = new Set(loadAcks(sid));
  for (const id of ids) set.add(id);
  const next = [...set].slice(-400);
  localStorage.setItem(ackKey(sid), JSON.stringify(next));
  return next;
};

/** Every visitor gets a unique 4-char tag derived from their conversation id,
 *  so two people called "Rahul" never look like the same person in the inbox. */
const handleOf = (sid: string) => sid.slice(0, 4);

/** Questions we sent, kept as sealed envelopes so a returning visit (or an
 *  inbox that was closed at the time) still receives them. */
const loadOut = (sid: string): AskEnvelope[] => {
  try {
    return JSON.parse(localStorage.getItem(outKey(sid)) ?? '[]') as AskEnvelope[];
  } catch {
    return [];
  }
};

const rememberOut = (sid: string, env: AskEnvelope) => {
  const list = loadOut(sid);
  if (list.some((e) => e.id === env.id)) return;
  list.push(env);
  localStorage.setItem(outKey(sid), JSON.stringify(list.slice(-200)));
};
const SYNC_MS = 15_000;
const HELLO_MS = 30_000;

export default function AskMe() {
  const [identity, setIdentity] = useState<VisitorIdentity | null>(null);
  const [messages, setMessages] = useState<AskMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [name, setName] = useState('');
  const [nameMissing, setNameMissing] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [live, setLive] = useState(isLive());
  const [closed, setClosed] = useState(false);
  /** replies that arrived while this tab was in the background */
  const [unreadReplies, setUnreadReplies] = useState(0);
  const [sending, setSending] = useState(false);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission | 'unsupported'>('default');
  const [flash, setFlash] = useState(false);
  // Hide the shortcut while the card itself is on screen — no point offering a
  // jump to something already in front of you.
  const [cardInView, setCardInView] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);
  /** Auto-scroll only while the reader is already at the bottom. */
  const stickRef = useRef(true);
  const upEnvelopes = useRef<Map<string, AskEnvelope>>(new Map());
  const ownerPub = useRef<CryptoKey | null>(null);
  const privKey = useRef<CryptoKey | null>(null);
  // Mirror of `messages` so the async wire handler always sees fresh history.
  const messagesRef = useRef<AskMessage[]>([]);
  const ackedRef = useRef<string[]>([]);
  const unackedRef = useRef<string[]>([]);
  const unreadTimer = useRef<number | null>(null);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Follow new messages down, unless the visitor scrolled up to read back — and
  // never while the tab is in the background (that would mark things seen
  // without anyone actually looking).
  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    const onScroll = () => {
      stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = threadRef.current;
    if (!el || !stickRef.current) return;
    if (document.visibilityState !== 'visible') return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Load (or mint) this browser's conversation identity and its local history.
  useEffect(() => {
    let alive = true;
    getVisitorIdentity().then(async (id) => {
      if (!alive) return;
      setIdentity(id);
      const deletedIds = new Set(loadDeleted(id.sid));
      try {
        const stored = JSON.parse(localStorage.getItem(threadKey(id.sid)) ?? '[]') as AskMessage[];
        setMessages(stored.filter((m) => !deletedIds.has(m.id)));
      } catch {
        setMessages([]);
      }
      for (const env of loadOut(id.sid)) if (!deletedIds.has(env.id)) upEnvelopes.current.set(env.id, env);
      ackedRef.current = loadAcks(id.sid);
      const savedName = localStorage.getItem(nameKey(id.sid));
      if (savedName) setName(savedName);
      setClosed(localStorage.getItem(closedKey(id.sid)) === '1');
      try {
        ownerPub.current = await getOwnerPub();
        if (id.privB64) privKey.current = await importPriv(id.privB64);
      } catch {
        /* decryption of old replies degrades to nothing */
      }
    });
    if ('Notification' in window) setNotifPerm(Notification.permission);
    return () => {
      alive = false;
    };
  }, []);

  const mergeMessages = useCallback((incoming: AskMessage[], sid: string) => {
    setMessages((prev) => {
      const byId = new Map(prev.map((m) => [m.id, m]));
      let added = 0;
      for (const m of incoming) {
        if (!byId.has(m.id)) {
          byId.set(m.id, m);
          added += 1;
        }
      }
      if (!added) return prev;
      const next = [...byId.values()].sort((a, b) => a.ts - b.ts);
      localStorage.setItem(threadKey(sid), JSON.stringify(next));
      return next;
    });
    return incoming;
  }, []);

  // Live link to the broker + subscribe to replies on our own topic.
  useEffect(() => {
    const unsubLink = onLinkChange(setLive);
    return () => {
      unsubLink();
    };
  }, []);

  useEffect(() => {
    if (!identity) return;
    let cancelled = false;

    const markSeen = (ids: string[]) => {
      const set = new Set(ids);
      setMessages((prev) => {
        let changed = false;
        const next = prev.map((m) => {
          if (m.mine && !m.seen && set.has(m.id)) {
            changed = true;
            return { ...m, seen: true, seenAt: Date.now() };
          }
          return m;
        });
        if (!changed) return prev;
        localStorage.setItem(threadKey(identity.sid), JSON.stringify(next));
        return next;
      });
    };

    const handleWire = async (wire: AskWire) => {
      if (wire.k === 'ack') {
        markSeen(wire.ids);
        return;
      }
      if (wire.k === 'closed') {
        localStorage.setItem(closedKey(identity.sid), wire.open ? '0' : '1');
        setClosed(!wire.open);
        return;
      }
      if (wire.k === 'del') {
        const gone = new Set(wire.ids);
        for (const id of wire.ids) upEnvelopes.current.delete(id);
        localStorage.setItem(delKey(identity.sid), JSON.stringify([...new Set([...loadDeleted(identity.sid), ...wire.ids])]));
        setMessages((prev) => {
          const next = prev.filter((m) => !gone.has(m.id));
          localStorage.setItem(threadKey(identity.sid), JSON.stringify(next));
          return next;
        });
        return;
      }
      if (!privKey.current) return;
      const envs = wire.k === 'sync' ? wire.envs : wire.k === 'env' ? [wire.env] : [];
      if (!envs.length) return;
      const opened: AskMessage[] = [];
      for (const env of envs) {
        try {
          // openWith() already returns the plaintext JSON string.
          const body = JSON.parse(await openWith(privKey.current, env.c)) as { text: string };
          opened.push({ id: env.id, ts: env.ts, text: body.text, mine: false });
        } catch {
          /* sealed for a different key — not ours to read */
        }
      }
      if (cancelled || !opened.length) return;
      const deleted = new Set(loadDeleted(identity.sid));
      const known = new Set(messagesRef.current.map((m) => m.id));
      const fresh = opened.filter((m) => !known.has(m.id) && !deleted.has(m.id));
      if (deleted.size) {
        for (let i = opened.length - 1; i >= 0; i -= 1) if (deleted.has(opened[i].id)) opened.splice(i, 1);
      }
      if (!fresh.length) return;
      mergeMessages(opened, identity.sid);
      setFlash(true);
      setTimeout(() => setFlash(false), 2600);

      const lastText = fresh[fresh.length - 1].text;
      if (document.visibilityState === 'visible') {
        // On screen right now: it is genuinely read, so ack it.
        ackedRef.current = rememberAcks(identity.sid, opened.map((m) => m.id));
        pub(topicUp(identity.sid), { k: 'ack', ids: ackedRef.current });
        announce('New message from Shashank', lastText);
        setUnreadReplies(count);
      } else {
        // Background tab: hold the receipt back until they actually return.
        unackedRef.current.push(...opened.map((m) => m.id));
        const count = unackedRef.current.length;
        setUnreadReplies(count);
        announce(
          `${count} new ${count === 1 ? 'message' : 'messages'} from Shashank`,
          lastText,
        );
      }
    };

    const unsub = sub(topicDown(identity.sid), handleWire);

    // Announce presence so the owner's inbox can pick the conversation up,
    // then keep the whole thread flowing so either side can catch up after
    // being offline.
    // Coming back to the tab: this is the point where replies become "read".
    const onVisible = () => {
      if (document.visibilityState !== 'visible' || !unackedRef.current.length) return;
      const count = unackedRef.current.length;
      const ids = unackedRef.current;
      unackedRef.current = [];
      ackedRef.current = rememberAcks(identity.sid, ids);
      pub(topicUp(identity.sid), { k: 'ack', ids: ackedRef.current });
      stickRef.current = true;        const wasZero = count === 0;
        setUnreadReplies(count);
        if (wasZero && unreadTimer.current) window.clearTimeout(unreadTimer.current);
        if (count > 0 && !unreadTimer.current) {
          unreadTimer.current = window.setTimeout(() => setUnreadReplies(prev => prev > 0 ? prev - 1 : 0), 6000);
        }
    };
    document.addEventListener('visibilitychange', onVisible);

    const announcePresence = () => pub(TOPIC_LOBBY, { k: 'hello', sid: identity.sid });
    const syncThread = () => {
      const envs = [...upEnvelopes.current.values()];
      if (envs.length) pub(topicUp(identity.sid), { k: 'sync', envs });
      if (ackedRef.current.length) pub(topicUp(identity.sid), { k: 'ack', ids: ackedRef.current });
    };
    // Wait for the SUBACK before the first publishes, otherwise the broker can
    // drop the opening hello/sync into the void.
    const bootTimer = window.setTimeout(() => {
      announcePresence();
      syncThread();
    }, 900);
    const helloTimer = window.setInterval(announcePresence, HELLO_MS);
    const syncTimer = window.setInterval(syncThread, SYNC_MS);

    return () => {
      cancelled = true;
      unsub();
      window.clearTimeout(bootTimer);
      window.clearInterval(helloTimer);
      window.clearInterval(syncTimer);
      document.removeEventListener('visibilitychange', onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity?.sid]);

  const send = useCallback(async () => {
    const text = draft.trim();
    if (!identity || sending) return;
    const cleanName = name.trim();
    // The name is what identifies this person in the inbox — no name, no send.
    if (!cleanName) {
      setNameMissing(true);
      nameRef.current?.focus();
      return;
    }
    if (!text) return;
    // Ask for notification permission right here, synchronously inside the
    // click gesture — browsers refuse the prompt if it arrives after an await.
    if ('Notification' in window && Notification.permission === 'default') {
      void requestNotifications().then(setNotifPerm);
    }
    setSending(true);
    try {
      if (!ownerPub.current) ownerPub.current = await getOwnerPub();
      const sealed = await sealFor(
        ownerPub.current,
        JSON.stringify({ text, name: `${cleanName} #${handleOf(identity.sid)}` }),
      );
      localStorage.setItem(nameKey(identity.sid), cleanName);
      const env: AskEnvelope = {
        v: 1,
        sid: identity.sid,
        id: crypto.randomUUID(),
        ts: Date.now(),
        c: sealed,
        pub: identity.pubB64,
      };
      upEnvelopes.current.set(env.id, env);
      rememberOut(identity.sid, env);
      pub(topicUp(identity.sid), { k: 'env', env });
      stickRef.current = true; // sending always jumps to the newest message
      setMessages((prev) => {
        const next = [...prev, { id: env.id, ts: env.ts, text, mine: true }].sort((a, b) => a.ts - b.ts);
        localStorage.setItem(threadKey(identity.sid), JSON.stringify(next));
        return next;
      });
      setDraft('');
      setEditingName(false);
    } catch {
      /* sealing failed (rare) — leave the draft intact for a retry */
    } finally {
      setSending(false);
    }
  }, [draft, identity, name, nameRef, sending]);

  const enableNotifications = useCallback(async () => {
    setNotifPerm(await requestNotifications());
  }, []);

  /** Owner closed the chat: start over with a brand-new conversation. */
  const startFreshChat = useCallback(async () => {
    const next = await resetVisitorIdentity();
    upEnvelopes.current.clear();
    ackedRef.current = [];
    setMessages([]);
    setDraft('');
    setClosed(false);
    setIdentity(next);
  }, []);

  useEffect(() => {
    if (editingName) nameRef.current?.focus();
  }, [editingName]);

  useEffect(() => {
    const card = document.getElementById('ask-me-card');
    if (!card || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setCardInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(card);
    return () => io.disconnect();
  }, []);

  // Sticky shortcut: glide down to the card, then put the caret in the box.
  const jumpToCard = useCallback(() => {
    const card = document.getElementById('ask-me-card');
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // No name yet? Land them on the required field instead of the textarea.
    const target = name.trim() ? inputRef.current : nameRef.current;
    window.setTimeout(() => target?.focus({ preventScroll: true }), 650);
  }, [name]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <>
    <div id="ask-me-card" className={`ask-card${flash ? ' ask-card--flash' : ''}`}>
      <div className="ask-head">
        <h3 className="ask-title">Ask Me Anything</h3>
        <span className={`ask-live${live ? ' is-live' : ''}`} title={live ? 'Connected' : 'Reconnecting…'}>
          <span className="ask-live-dot" aria-hidden="true" />
          {live ? 'Live' : 'Offline'}
        </span>
      </div>
        <p className="ask-sub">
          Write any question below and hit send — it reaches Shashank directly and only Shashank can read it. Replies
          appear right here. Turn on notifications to get a notification the moment I answer.
        </p>

      {unreadReplies > 0 && (
        <div className="ask-new">
          <span>
            {unreadReplies} new {unreadReplies === 1 ? 'message' : 'messages'} from Shashank
          </span>
          <button
            type="button"
            className="ask-new-btn"
            onClick={() => {
              setUnreadReplies(0);
              stickRef.current = true;
              const el = threadRef.current;
              if (el) el.scrollTop = el.scrollHeight;
            }}
          >
            View
          </button>
        </div>
      )}

      <div className="ask-thread" role="log" aria-live="polite" ref={threadRef}>
        {messages.length === 0 && <div className="ask-empty">No messages yet — say hello 👋</div>}
        {messages.map((m) => (
          <div key={m.id} className={`ask-bubble${m.mine ? ' ask-bubble--mine' : ' ask-bubble--them'}`}>
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

      {closed ? (
        <div className="ask-closed">
          <span className="ask-closed-title">This chat was closed</span>
          <p className="ask-closed-text">
            Shashank has closed this conversation, so no new messages can go here. Start a fresh chat and ask
            anything — he&apos;ll see it as a new conversation.
          </p>
          <button type="button" className="ask-send" onClick={() => void startFreshChat()}>
            Start a fresh chat
          </button>
        </div>
      ) : (
      <div className="ask-composer">
        {!name.trim() || editingName ? (
          <div className="ask-who">
            <input
              ref={nameRef}
              className={`ask-name${nameMissing && !name.trim() ? ' ask-name--missing' : ''}`}
              type="text"
              placeholder="Your name (required)"
              value={name}
              maxLength={40}
              aria-invalid={nameMissing && !name.trim()}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setNameMissing(false);
              }}
              onBlur={(e) => {
                if (e.target.value.trim()) setEditingName(false);
              }}
            />
            <span className="ask-handle">
              {name.trim() && identity ? (
                <>
                  You&apos;ll appear as{' '}
                  <strong>
                    {name.trim()} #{handleOf(identity.sid)}
                  </strong>
                </>
              ) : (
                'Name is required — a unique tag is added automatically so you never get confused with anyone else.'
              )}
            </span>
          </div>
        ) : (
          <div className="ask-as">
            <span>
              Sending as{' '}
              <strong>{name.trim()}</strong>
              {identity && <span className="ask-tag">#{handleOf(identity.sid)}</span>}
            </span>
            <button type="button" className="ask-as-edit" onClick={() => setEditingName(true)}>
              change
            </button>
          </div>
        )}
        {nameMissing && !name.trim() && (
          <p className="ask-error">Enter your name first — that&apos;s how I know who I&apos;m replying to.</p>
        )}
        <textarea
          ref={inputRef}
          className="ask-input"
          placeholder="Type your question…"
          value={draft}
          maxLength={800}
          rows={2}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <p className="ask-privacy">
          <span aria-hidden="true">🔒</span> Only you and Shashank can read this message — it&apos;s end-to-end
          encrypted, nobody else
          can see it.
        </p>
        <div className="ask-actions">
          <button
            type="button"
            className="ask-bell"
            onClick={enableNotifications}
            title="Get a desktop notification when I reply"
            disabled={notifPerm === 'granted' || notifPerm === 'denied' || notifPerm === 'unsupported'}
          >
            {notifPerm === 'granted' ? '🔔 Notifications on' : notifPerm === 'denied' ? '🔕 Blocked in browser' : '🔔 Notify me of replies'}
          </button>
          <button type="button" className="ask-send" onClick={() => void send()} disabled={!draft.trim() || sending}>
            {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
      )}
    </div>

    {/* Portalled to <body>: the contact section is transformed by the scroll
        reveal, which would trap a position:fixed child inside it. */}
    {createPortal(
      <button
        type="button"
        className={`ask-fab${flash ? ' ask-fab--flash' : ''}${cardInView ? ' ask-fab--hidden' : ''}`}
        onClick={jumpToCard}
        title="Ask me anything"
        aria-hidden={cardInView}
        tabIndex={cardInView ? -1 : 0}
      >
        <span className="ask-fab-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.8 9.8 0 0 1-3.2-.6L3 21l1.7-4.6A8.3 8.3 0 0 1 3.6 11.5a8.4 8.4 0 0 1 8.4-8.4h.5a8.4 8.4 0 0 1 8.5 8.4Z" />
          </svg>
        </span>
        <span className="ask-fab-text">
          <strong>Ask me anything</strong>
        </span>
      </button>,
      document.body,
    )}
    </>
  );
}
