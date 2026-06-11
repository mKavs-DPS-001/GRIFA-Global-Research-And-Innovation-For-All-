/**
 * Admin Inbox — live Firebase Firestore
 *
 * Collection: "inbox"
 * Document fields:
 *   name        string
 *   email       string
 *   subject     string
 *   tag         string  — "Problem Report" | "Support" | "General"
 *   status      string  — "Open" | "In Progress" | "Resolved"
 *   unread      boolean
 *   createdAt   Timestamp
 *   messages    array of { from: string, text: string, time: string }
 *
 * TODO: When the "Report a Problem" form (ImpactMap.jsx) is submitted,
 * also call addDoc(collection(db, 'inbox'), { name, email, subject: form.title,
 * tag: 'Problem Report', status: 'Open', unread: true, createdAt: serverTimestamp(),
 * messages: [{ from: 'user', text: form.description, time: new Date().toISOString() }] })
 * — it will auto-appear here in real-time.
 */

import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../../firebase/config';
import { db } from '../../firebase/config';
import { Send, Search, Inbox as InboxIcon, Circle } from 'lucide-react';

// ─── Tag & Status config ──────────────────────────────────────────────────────

const TAG_CFG = {
  'Problem Report': { bg: '#FEE2E2', color: '#DC2626' },
  'Support':        { bg: '#FEF3C7', color: '#D97706' },
  'General':        { bg: '#DBEAFE', color: '#1D4ED8' },
};

const STATUS_OPTS = ['Open', 'In Progress', 'Resolved'];

const STATUS_COLOR = {
  'Open':        '#EF4444',
  'In Progress': '#F59E0B',
  'Resolved':    '#10B981',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TagBadge({ tag }) {
  const cfg = TAG_CFG[tag] || { bg: '#F1F5F9', color: '#475569' };
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 20, fontSize: 10,
      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
      background: cfg.bg, color: cfg.color,
    }}>
      {tag}
    </span>
  );
}

function Avatar({ name }) {
  const initials = (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const hue = [...(name || '')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
      background: `hsl(${hue},55%,52%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 800, color: '#fff',
    }}>
      {initials}
    </div>
  );
}

// ─── Main Inbox ───────────────────────────────────────────────────────────────

export default function Inbox({ onUnreadChange }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [fbError, setFbError]             = useState('');
  const [selected, setSelected]           = useState(null);
  const [search, setSearch]               = useState('');
  const [reply, setReply]                 = useState('');
  const [sending, setSending]             = useState(false);
  const [filterTag, setFilterTag]         = useState('All');
  const messagesEndRef                    = useRef(null);

  // ── Real-time listener ───────────────────────────────────────────────────
  const getToken = async () => auth.currentUser?.getIdToken();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://grifa.bydps.com'}/api/v1/contact/admin/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const docs = data.data.map(d => ({
            id: d.id,
            name: d.name,
            email: d.email,
            subject: d.subject,
            tag: 'General',
            status: 'Open',
            unread: !d.read,
            createdAt: new Date(d.createdAt),
            messages: [{ from: 'user', text: d.message, time: d.createdAt }]
          }));
          setConversations(docs);
          if (onUnreadChange) onUnreadChange(docs.filter(c => c.unread).length);
          setSelected(prev => prev ? (docs.find(d => d.id === prev.id) || prev) : prev);
        }
      } catch (err) {
        setFbError(`API error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Scroll to bottom of message thread when it changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages?.length]);

  // ── Select a conversation → mark unread:false ────────────────────────────
  const handleSelect = async conv => {
    setSelected(conv);
    setReply('');
    // For MVP, marking as read locally only
    if (conv.unread) {
      setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unread: false } : c));
    }
  };

  // ── Send a reply ─────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    const msg = {
      from: 'admin',
      text: reply.trim(),
      time: new Date().toISOString(),
    };
    try {
      // For MVP, update locally since we didn't implement reply API
      const updatedConv = { ...selected, messages: [...selected.messages, msg] };
      setConversations(prev => prev.map(c => c.id === selected.id ? updatedConv : c));
      setSelected(updatedConv);
      setReply('');
    } catch (e) {
      console.error('send reply error:', e);
      alert('Failed to send reply: ' + e.message);
    } finally {
      setSending(false);
    }
  };

  // ── Change status ────────────────────────────────────────────────────────
  const handleStatus = async (id, status) => {
    // For MVP, update locally
    setConversations(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
  };

  // ── Filter + search ──────────────────────────────────────────────────────
  const visible = conversations.filter(c => {
    const matchSearch = !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase());
    const matchTag = filterTag === 'All' || c.tag === filterTag;
    return matchSearch && matchTag;
  });

  const unreadCount = conversations.filter(c => c.unread).length;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 108px)', gap: 0, border: '1px solid #E8EDF5', borderRadius: 16, overflow: 'hidden', background: '#fff' }}>

      {/* ── LEFT PANEL — conversation list ── */}
      <div style={{ width: 320, flexShrink: 0, borderRight: '1px solid #E8EDF5', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '18px 16px 12px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <InboxIcon size={18} color="#1A56DB" />
            <span style={{ fontSize: 16, fontWeight: 800, color: '#0B1F3A' }}>Inbox</span>
            {unreadCount > 0 && (
              <span style={{ marginLeft: 'auto', background: '#EF4444', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>
                {unreadCount} new
              </span>
            )}
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, subject…"
              style={{ width: '100%', padding: '8px 10px 8px 30px', border: '1px solid #E2E8F0', borderRadius: 9, fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#0B1F3A', background: '#F8FAFF' }}
            />
          </div>

          {/* Tag filter */}
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {['All', 'Problem Report', 'Support', 'General'].map(t => (
              <button
                key={t}
                onClick={() => setFilterTag(t)}
                style={{ padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, background: filterTag === t ? '#1A56DB' : '#F1F5F9', color: filterTag === t ? '#fff' : '#64748B', transition: 'all 0.15s' }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>Loading…</div>
          ) : fbError ? (
            <div style={{ padding: 16, margin: 12, background: '#FEF2F2', borderRadius: 10, fontSize: 12, color: '#991B1B' }}>⚠️ {fbError}</div>
          ) : visible.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
              <InboxIcon size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
              No conversations yet.
            </div>
          ) : (
            visible.map(conv => {
              const isActive = selected?.id === conv.id;
              const lastMsg  = conv.messages?.[conv.messages.length - 1];
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelect(conv)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid #F8FAFF',
                    cursor: 'pointer',
                    background: isActive ? '#EFF6FF' : conv.unread ? '#FAFBFF' : '#fff',
                    borderLeft: isActive ? '3px solid #1A56DB' : '3px solid transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <Avatar name={conv.name} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: conv.unread ? 800 : 600, color: '#0B1F3A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
                          {conv.name || 'Unknown'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                          {conv.unread && <Circle size={8} fill="#1A56DB" color="#1A56DB" />}
                          <span style={{ fontSize: 10, color: '#94A3B8' }}>
                            {conv.createdAt instanceof Date && !isNaN(conv.createdAt) ? conv.createdAt.toLocaleDateString('en-IN') : '—'}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: '#0B1F3A', fontWeight: conv.unread ? 700 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
                        {conv.subject || '(No subject)'}
                      </div>
                      <div style={{ fontSize: 11, color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>
                        {lastMsg?.text || '—'}
                      </div>
                      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                        <TagBadge tag={conv.tag} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: STATUS_COLOR[conv.status] || '#64748B' }}>
                          ● {conv.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL — message thread ── */}
      {selected ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Thread header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #E8EDF5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={selected.name} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0B1F3A' }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{selected.email} · {selected.subject}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <TagBadge tag={selected.tag} />
              <select
                value={selected.status}
                onChange={e => handleStatus(selected.id, e.target.value)}
                style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 700, color: STATUS_COLOR[selected.status] || '#0B1F3A', cursor: 'pointer', background: '#F8FAFF', outline: 'none' }}
              >
                {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14, background: '#F8FAFF' }}>
            {(selected.messages || []).map((msg, i) => {
              const isAdmin = msg.from === 'admin';
              return (
                <div
                  key={i}
                  style={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start' }}
                >
                  <div style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: isAdmin ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: isAdmin ? '#1A56DB' : '#fff',
                    color: isAdmin ? '#fff' : '#0B1F3A',
                    fontSize: 13,
                    lineHeight: 1.6,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                  }}>
                    <p style={{ margin: '0 0 4px' }}>{msg.text}</p>
                    <p style={{ margin: 0, fontSize: 10, opacity: 0.65, textAlign: isAdmin ? 'right' : 'left' }}>
                      {msg.time ? new Date(msg.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                      {' · '}{isAdmin ? 'Admin' : selected.name}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply box */}
          <div style={{ padding: '14px 20px', borderTop: '1px solid #E8EDF5', background: '#fff', display: 'flex', gap: 10, alignItems: 'flex-end', flexShrink: 0 }}>
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type a reply… (Enter to send, Shift+Enter for newline)"
              rows={2}
              style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'inherit', color: '#0B1F3A', background: '#F8FAFF', lineHeight: 1.5 }}
            />
            <button
              onClick={handleSend}
              disabled={sending || !reply.trim()}
              style={{ padding: '10px 18px', background: sending || !reply.trim() ? '#CBD5E1' : '#1A56DB', color: '#fff', border: 'none', borderRadius: 10, cursor: sending || !reply.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, flexShrink: 0, transition: 'background 0.15s' }}
            >
              <Send size={15} /> {sending ? 'Sending…' : 'Send'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: '#94A3B8', background: '#F8FAFF' }}>
          <InboxIcon size={48} style={{ opacity: 0.2 }} />
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Select a conversation to read</p>
        </div>
      )}
    </div>
  );
}
