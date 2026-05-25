import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, BarChart2, FileText, BadgeCheck,
  Layers, Settings, LogOut, ChevronRight, Shield, Flag, Inbox, Menu, X
} from 'lucide-react';

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    label: 'Analytics',
    items: [
      { id: 'overview',    label: 'Overview',          icon: LayoutDashboard },
      { id: 'enrollments', label: 'Enrollments',       icon: Users           },
      { id: 'analytics',   label: 'Tier Analytics',   icon: BarChart2       },
      { id: 'community',   label: 'Community Reports', icon: Flag            },
    ],
  },
  {
    label: 'Content',
    items: [
      { id: 'problems',    label: 'Problem Manager',   icon: FileText    },
      { id: 'scientists',  label: 'Scientist Manager', icon: BadgeCheck  },
      { id: 'simulator',   label: 'Plans Simulator',   icon: Layers      },
    ],
  },
  {
    label: 'Communication',
    items: [
      { id: 'inbox', label: 'Inbox', icon: Inbox },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

const PAGE_TITLES = {
  overview:    'Overview',
  enrollments: 'Enrollments',
  analytics:   'Tier Analytics',
  community:   'Community Reports',
  inbox:       'Inbox',
  problems:    'Problem Manager',
  scientists:  'Scientist Manager',
  simulator:   'Plans Simulator',
  settings:    'Settings',
};

// ─── Live Clock ───────────────────────────────────────────────────────────────

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="text-sm text-gray-500 font-mono tabular-nums">
      {now.toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true,
      })}
    </span>
  );
}

// ─── AdminLayout ──────────────────────────────────────────────────────────────

export default function AdminLayout({ currentPage, navigate, inboxUnread = 0, children }) {
  const { toggleAdminMode, logout, currentUser } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleExit = async () => {
    await logout();
    window.location.href = '/';
  };

  // Close mobile sidebar on route change
  useEffect(() => { setMobileSidebarOpen(false); }, [currentPage]);

  const SIDEBAR_W = sidebarCollapsed ? 64 : 240;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8FAFF' }}>

      {/* ── Mobile overlay backdrop ── */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 150, display: 'block',
          }}
          className="md:hidden"
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: SIDEBAR_W,
        minWidth: SIDEBAR_W,
        background: '#0B1F3A',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease, transform 0.25s ease',
        overflow: 'hidden',
        zIndex: 160,
        // On mobile: fixed overlay, hidden by default
        position: undefined,
      }}
      className={`
        max-md:fixed max-md:top-0 max-md:left-0 max-md:h-full max-md:z-[160]
        ${mobileSidebarOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}
      `}>

        {/* Brand */}
        <div style={{
          padding: sidebarCollapsed ? '20px 16px' : '20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minHeight: 64,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#EF4444', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 16, flexShrink: 0,
          }}>🔐</div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, lineHeight: 1.1 }}>GRIFA Admin</div>
              <div style={{ color: '#EF4444', fontSize: 10, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>
                by DPSP
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(c => !c)}
            style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4,
              display: 'flex', alignItems: 'center',
              transform: sidebarCollapsed ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s',
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {NAV_SECTIONS.map(section => (
            <div key={section.label} style={{ marginBottom: 8 }}>
              {!sidebarCollapsed && (
                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
                  padding: '8px 20px 4px',
                }}>
                  {section.label}
                </p>
              )}
              {section.items.map(({ id, label, icon: Icon }) => {
                const active = currentPage === id;
                const badge = id === 'inbox' && inboxUnread > 0 ? inboxUnread : 0;
                return (
                  <button
                    key={id}
                    onClick={() => navigate(id)}
                    title={sidebarCollapsed ? label : undefined}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      gap: 10, padding: sidebarCollapsed ? '10px 20px' : '9px 20px',
                      background: active ? 'rgba(26,86,219,0.15)' : 'transparent',
                      border: 'none',
                      borderLeft: active ? '3px solid #1A56DB' : '3px solid transparent',
                      color: active ? '#60A5FA' : 'rgba(255,255,255,0.6)',
                      cursor: 'pointer', textAlign: 'left',
                      fontSize: 13, fontWeight: active ? 600 : 400,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = active ? '#60A5FA' : 'rgba(255,255,255,0.6)'; }}
                  >
                    <Icon size={16} style={{ flexShrink: 0 }} />
                    {!sidebarCollapsed && <span style={{ flex: 1 }}>{label}</span>}
                    {badge > 0 && (
                      <span style={{
                        background: '#EF4444', color: '#fff',
                        fontSize: 10, fontWeight: 800,
                        padding: '1px 6px', borderRadius: 20,
                        minWidth: 18, textAlign: 'center',
                        flexShrink: 0,
                      }}>
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: sidebarCollapsed ? '12px 16px' : '12px 16px',
        }}>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#EF4444' }}>A</span>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Admin</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
                  {currentUser?.email || 'admin@grifa.in'}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleExit}
            title="Exit Admin Mode"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: 8, padding: '8px 10px', background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8,
              color: '#EF4444', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            }}
          >
            <LogOut size={14} />
            {!sidebarCollapsed && 'Exit Admin Mode'}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Top Bar */}
        <header style={{
          height: 60, background: '#fff',
          borderBottom: '1px solid #E8EDF5',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px', flexShrink: 0,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(o => !o)}
              className="md:hidden"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#0B1F3A', display: 'flex', alignItems: 'center', flexShrink: 0 }}
              aria-label="Toggle sidebar"
            >
              <Menu size={22} />
            </button>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#0B1F3A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {PAGE_TITLES[currentPage] || 'Admin'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <LiveClock />
            <span style={{
              background: '#FEE2E2', color: '#EF4444',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
              padding: '4px 10px', borderRadius: 20,
              border: '1px solid rgba(239,68,68,0.3)',
              textTransform: 'uppercase',
            }}>
              🔐 GRIFA Admin Portal
            </span>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 24, background: '#F8FAFF' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
