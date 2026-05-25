import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { ROLES, CATEGORIES, CAT_STYLE, DIFF_STYLE } from '../data/rolesData';
import { engineeringProblems }   from '../data/problems/engineering';
import { socialSciencesProblems } from '../data/problems/socialSciences';
import { creativeProblems }       from '../data/problems/creative';
import { lifeSciencesProblems }   from '../data/problems/lifeSciences';
import { businessProblems }       from '../data/problems/business';
import { lawProblems }            from '../data/problems/law';
import { languageProblems }       from '../data/problems/language';
import * as LucideIcons from 'lucide-react';
import { X, ChevronDown, ChevronUp, MapPin, Users, Compass } from 'lucide-react';

// ─── Merge all problem data ───────────────────────────────────────────────────
const ALL_PROBLEMS = {
  ...engineeringProblems,
  ...socialSciencesProblems,
  ...creativeProblems,
  ...lifeSciencesProblems,
  ...businessProblems,
  ...lawProblems,
  ...languageProblems,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getIcon(name, size = 22, color = '#1A56DB') {
  const Icon = LucideIcons[name] || LucideIcons['Briefcase'];
  return <Icon size={size} color={color} />;
}

function CatBadge({ cat }) {
  const s = CAT_STYLE[cat] || { bg: '#F1F5F9', color: '#475569' };
  return (
    <span style={{
      padding: '2px 9px', borderRadius: 20, fontSize: 10,
      fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
      background: s.bg, color: s.color,
    }}>{cat}</span>
  );
}

function DiffBadge({ diff }) {
  const s = DIFF_STYLE[diff] || { bg: '#F1F5F9', color: '#475569' };
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 6, fontSize: 10,
      fontWeight: 700, background: s.bg, color: s.color,
    }}>{diff}</span>
  );
}

// ─── Role Card ────────────────────────────────────────────────────────────────
function RoleCard({ role, onClick, active }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onClick(role)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: '22px 20px',
        border: `2px solid ${active ? '#1A56DB' : hov ? '#1A56DB40' : '#E8EDF5'}`,
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? '0 12px 32px rgba(26,86,219,0.12)' : '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {getIcon(role.icon, 22, '#1A56DB')}
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#1A56DB', background: '#EFF6FF', padding: '3px 8px', borderRadius: 20 }}>
          {role.count.toLocaleString()} problems
        </span>
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0B1F3A', margin: '0 0 6px', lineHeight: 1.3 }}>{role.title}</h3>
      <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 12px', lineHeight: 1.5 }}>{role.desc}</p>
      <CatBadge cat={role.cat} />
    </div>
  );
}

// ─── Problem Card ─────────────────────────────────────────────────────────────
function ProblemCard({ prob }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#fff' : '#F3F4F6',
        borderRadius: 12,
        padding: '16px 18px',
        transition: 'all 0.15s',
        boxShadow: hov ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0B1F3A', margin: 0, lineHeight: 1.4, flex: 1, paddingRight: 8 }}>{prob.title}</h4>
        <DiffBadge diff={prob.difficulty} />
      </div>
      <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 10px', lineHeight: 1.5 }}>{prob.description}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {prob.disciplines.map(d => (
          <span key={d} style={{ fontSize: 10, fontWeight: 600, color: '#475569', background: '#E2E8F0', padding: '2px 7px', borderRadius: 6 }}>{d}</span>
        ))}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('openEnquiry'))}
          style={{
            marginLeft: 'auto', padding: '5px 12px', background: '#1A56DB', color: '#fff',
            border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          🔬 I want to research this
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Roles() {
  const [activeFilter, setFilter] = useState('All');
  const [showAll, setShowAll]     = useState(false);
  const [selected, setSelected]   = useState(null);
  const panelRef                  = useRef(null);

  const filtered = activeFilter === 'All'
    ? ROLES
    : ROLES.filter(r => r.cat === activeFilter);

  const visible = showAll ? filtered : filtered.slice(0, 10);

  const handleRoleClick = role => {
    if (selected?.id === role.id) { setSelected(null); return; }
    setSelected(role);
    setTimeout(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  // Reset showAll when filter changes
  useEffect(() => { setShowAll(false); setSelected(null); }, [activeFilter]);

  const roleProblems = selected ? (ALL_PROBLEMS[selected.title] || []) : [];
  const collaboratingRoles = selected
    ? ROLES.filter(r => selected.collab.includes(r.title)).slice(0, 5)
    : [];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', fontFamily: "'Inter', sans-serif" }}>
      <Helmet>
        <title>Explore Roles | GRIFA</title>
        <meta name="description" content="Find your role in research. Every discipline has a place in solving India's real problems." />
      </Helmet>

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #1A3A6B 100%)', padding: '56px 24px 48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: '6px 16px', marginBottom: 20 }}>
          <Compass size={14} color="#F59E0B" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Discover Your Role</span>
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 900, color: '#fff', margin: '0 0 14px', fontFamily: "'Playfair Display', serif", lineHeight: 1.15 }}>
          Find Your Role in Research
        </h1>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.72)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Every discipline has a place in solving India's real problems. Discover yours.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#F59E0B' }}>{ROLES.length}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Roles Listed</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#F59E0B' }}>700+</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Problem Statements</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '10px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#F59E0B' }}>7</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Disciplines</div>
          </div>
        </div>
      </div>

      {/* ── Filter Row ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8EDF5', padding: '0 24px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {CATEGORIES.map(cat => {
          const active = activeFilter === cat;
          const s = CAT_STYLE[cat] || { color: '#0B1F3A' };
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '14px 16px', background: 'none', border: 'none',
                borderBottom: active ? `3px solid ${s.color || '#0B1F3A'}` : '3px solid transparent',
                color: active ? (s.color || '#0B1F3A') : '#64748B',
                fontWeight: active ? 700 : 500, fontSize: 13,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>

        {/* Roles grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
          {visible.map(role => (
            <RoleCard key={role.id} role={role} onClick={handleRoleClick} active={selected?.id === role.id} />
          ))}
        </div>

        {/* View All / Show Less button */}
        {filtered.length > 10 && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <button
              onClick={() => { setShowAll(s => !s); if (showAll) setSelected(null); }}
              style={{
                padding: '12px 28px', border: '2px solid #1A56DB', background: 'transparent',
                color: '#1A56DB', borderRadius: 12, fontWeight: 700, fontSize: 14,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'all 0.15s', fontFamily: 'inherit',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1A56DB'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1A56DB'; }}
            >
              {showAll
                ? <><ChevronUp size={16} /> Show Less</>
                : <><ChevronDown size={16} /> View All {filtered.length} Roles</>}
            </button>
          </div>
        )}

        {/* ── Role Detail Panel ── */}
        {selected && (
          <div
            ref={panelRef}
            style={{
              background: '#fff',
              borderRadius: 20,
              border: '1px solid #E8EDF5',
              borderLeft: '4px solid #1A56DB',
              padding: '32px 28px',
              animation: 'slideIn 0.25s ease',
              marginBottom: 32,
            }}
          >
            {/* Panel header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getIcon(selected.icon, 28, '#1A56DB')}
                </div>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0B1F3A', margin: '0 0 6px' }}>{selected.title}</h2>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <CatBadge cat={selected.cat} />
                    <span style={{ fontSize: 12, color: '#64748B' }}>{selected.count.toLocaleString()} matching problems</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: 10, padding: 10, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <X size={18} color="#64748B" />
              </button>
            </div>

            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, maxWidth: 700, marginBottom: 28 }}>
              {selected.desc} As a <strong>{selected.title}</strong> in India, you sit at the intersection of real-world challenges and academic rigour — your discipline brings an irreplaceable lens to problems no one else can see the same way.
            </p>

            {/* Collaborating Disciplines */}
            {collaboratingRoles.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Users size={16} color="#1A56DB" />
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0B1F3A', margin: 0, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Collaborating Disciplines</h3>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {collaboratingRoles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleRoleClick(r)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                        background: '#F8FAFF', border: '1.5px solid #E2E8F0', borderRadius: 10,
                        cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#0B1F3A',
                        transition: 'border-color 0.15s', fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#1A56DB'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
                    >
                      {getIcon(r.icon, 14, '#1A56DB')}
                      {r.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Problems */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <MapPin size={16} color="#1A56DB" />
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0B1F3A', margin: 0, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Problems Waiting For You ({roleProblems.length})
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
                {roleProblems.map((prob, i) => (
                  <ProblemCard key={i} prob={prob} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
      `}</style>
    </div>
  );
}
