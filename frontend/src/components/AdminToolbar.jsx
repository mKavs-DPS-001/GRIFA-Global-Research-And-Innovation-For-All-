import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LayoutDashboard, Users, CreditCard, ChevronLeft, ChevronRight, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',     path: '/admin-dashboard' },
  { icon: Users,           label: 'Enrollments',   path: '/admin-dashboard#enrollments' },
  { icon: CreditCard,      label: 'Plans Preview',  path: '/plans' },
];

export default function AdminToolbar() {
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!isAdmin || dismissed) return null;

  const handleLogout = async () => {
    try { await logout(); navigate('/login'); } catch (e) { console.error(e); }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -80, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-stretch"
        style={{ filter: 'drop-shadow(0 8px 32px rgba(11,31,58,0.28))' }}
      >
        {/* Sidebar Panel */}
        <div
          className={`bg-primary border-r border-white/10 flex flex-col transition-all duration-300 ${
            collapsed ? 'w-0 overflow-hidden' : 'w-48'
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
            <Shield size={14} className="text-accent-light shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-light whitespace-nowrap">
              Admin Mode
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex-1 py-2">
            {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
              const isActive = location.pathname === path.split('#')[0];
              return (
                <Link
                  key={label}
                  to={path}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-neutral-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={15} className="shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/10 p-2 space-y-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-900/30 rounded-lg transition-colors whitespace-nowrap"
            >
              <LogOut size={13} /> Exit Admin
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-neutral-white/30 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap"
            >
              <X size={13} /> Hide Panel
            </button>
          </div>
        </div>

        {/* Collapse toggle tab */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="bg-primary border-y border-r border-white/10 flex items-center justify-center w-5 hover:bg-accent transition-colors rounded-r-lg"
          aria-label={collapsed ? 'Expand admin panel' : 'Collapse admin panel'}
        >
          {collapsed
            ? <ChevronRight size={12} className="text-white/60" />
            : <ChevronLeft  size={12} className="text-white/60" />
          }
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
