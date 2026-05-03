import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, GitBranch, Bookmark, BookOpen,
  CreditCard, Award, Users, BarChart2, Settings, LogOut,
} from 'lucide-react';

import Overview      from '../dashboard/Overview';
import Pipeline      from '../dashboard/Pipeline';
import SavedProblems from '../dashboard/SavedProblems';
import Journal       from '../dashboard/Journal';
import MyPlan        from '../dashboard/MyPlan';
import Certificates  from '../dashboard/Certificates';
import Mentor        from '../dashboard/Mentor';
import Leaderboard   from '../dashboard/Leaderboard';

const NAV = [
  { group: 'MY RESEARCH', items: [
    { id: 'overview',  label: 'Overview',          icon: LayoutDashboard },
    { id: 'pipeline',  label: 'Research Pipeline', icon: GitBranch       },
    { id: 'saved',     label: 'Saved Problems',    icon: Bookmark        },
    { id: 'journal',   label: 'My Journal',        icon: BookOpen        },
  ]},
  { group: 'LEARNING', items: [
    { id: 'plan',     label: 'My Plan',       icon: CreditCard },
    { id: 'certs',    label: 'Certificates',  icon: Award      },
    { id: 'mentor',   label: 'Mentor',        icon: Users      },
  ]},
  { group: 'ACTIVITY', items: [
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart2 },
  ]},
];

const SECTIONS = {
  overview:    <Overview />,
  pipeline:    <Pipeline />,
  saved:       <SavedProblems />,
  journal:     <Journal />,
  plan:        <MyPlan />,
  certs:       <Certificates />,
  mentor:      <Mentor />,
  leaderboard: <Leaderboard />,
};

const S = {
  sidebar: { width: 220, background: '#fff', borderRight: '1px solid #E8EDF5', position: 'fixed', top: 64, bottom: 0, left: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', zIndex: 40 },
  main:    { marginLeft: 220, minHeight: '100vh', paddingTop: 80, paddingBottom: 48, background: '#F8FAFC' },
  inner:   { maxWidth: 960, margin: '0 auto', padding: '0 24px' },
  group:   { padding: '16px 12px 4px', fontSize: 10, fontWeight: 800, color: '#94A3B8', letterSpacing: 1.2, textTransform: 'uppercase' },
  navBtn:  (active) => ({
    display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 14px',
    border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 600,
    background: active ? '#EFF6FF' : 'transparent',
    color: active ? '#2563EB' : '#475569',
    borderLeft: active ? '3px solid #2563EB' : '3px solid transparent',
    transition: 'all 0.15s',
  }),
};

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('overview');

  const avatarUrl = currentUser?.photoURL
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.email || 'U')}&background=1A56DB&color=fff&size=80`;

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <>
      <Helmet><title>Dashboard | GRIFA</title></Helmet>

      {/* Sidebar */}
      <aside style={S.sidebar}>
        {/* Avatar */}
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={avatarUrl} alt="avatar" width="36" height="36" loading="lazy" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0B1F3A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.displayName || currentUser?.email?.split('@')[0]}
            </p>
            <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>Analyst Plan</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 8px' }}>
          {NAV.map(({ group, items }) => (
            <div key={group}>
              <p style={S.group}>{group}</p>
              {items.map(({ id, label, icon: Icon }) => (
                <button key={id} style={S.navBtn(active === id)} onClick={() => setActive(id)}>
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid #F1F5F9' }}>
          <button onClick={handleLogout} style={{ ...S.navBtn(false), color: '#EF4444' }}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={S.main}>
        <div style={S.inner}>
          {SECTIONS[active]}
        </div>
      </main>
    </>
  );
}
