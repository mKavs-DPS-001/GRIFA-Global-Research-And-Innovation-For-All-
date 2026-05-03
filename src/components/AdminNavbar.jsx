import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, LogOut, LayoutDashboard, Users, BarChart2, CreditCard, BookOpen, FlaskConical, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_NAV = [
  { name: 'Overview',         path: '/admin-dashboard',             icon: LayoutDashboard },
  { name: 'Enrollments',      path: '/admin-dashboard#enrollments', icon: Users           },
  { name: 'Tier Analytics',   path: '/admin-dashboard#analytics',   icon: BarChart2       },
  { name: 'Plans Simulator',  path: '/plans',                       icon: CreditCard      },
  { name: 'Problems',         path: '/problems',                    icon: BookOpen        },
  { name: 'Scientists',       path: '/scientists',                  icon: FlaskConical    },
  { name: 'Settings',         path: '/admin-settings',              icon: Settings        },
];

export default function AdminNavbar() {
  const [isScrolled, setIsScrolled]       = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { toggleAdminMode, logout, currentUser } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const handleExitAdmin = async () => {
    toggleAdminMode();          // flip isAdmin → false
    navigate('/');              // go home
  };

  const isActive = (path) => {
    const base = path.split('#')[0];
    if (base === '/admin-dashboard') return location.pathname === '/admin-dashboard';
    return location.pathname.startsWith(base);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-l-4 border-red-500 ${
        isScrolled
          ? 'bg-[#1C0505]/95 backdrop-blur-md shadow-xl shadow-red-950/30 py-3'
          : 'bg-[#2D0A0A] py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between gap-4">

        {/* Logo / Brand */}
        <Link to="/admin-dashboard" className="flex items-center gap-3 shrink-0 z-50" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '6px',
            background: '#EF4444', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '16px', flexShrink: 0,
          }}>
            🔐
          </div>
          <div>
            <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '15px', lineHeight: '1.1', letterSpacing: '0.5px' }}>
              ADMIN PANEL
            </div>
            <div style={{ color: '#EF4444', fontSize: '10px', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>
              GRIFA by DPSP
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-0.5 overflow-x-auto">
          {ADMIN_NAV.map(({ name, path, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={name}
                to={path}
                className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                style={{
                  color: active ? '#EF4444' : 'rgba(255,255,255,0.65)',
                  background: active ? 'rgba(239,68,68,0.08)' : 'transparent',
                  borderBottom: active ? '2px solid #EF4444' : '2px solid transparent',
                  paddingBottom: '6px',
                }}
              >
                <Icon size={14} className="shrink-0" />
                {name}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Avatar */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
              <span className="text-xs font-bold text-red-400">A</span>
            </div>
            <div className="leading-none">
              <p className="text-xs font-bold text-white/80">Admin</p>
              {currentUser?.email && (
                <p className="text-[10px] text-white/30 truncate max-w-[140px]">{currentUser.email}</p>
              )}
            </div>
          </div>

          {/* Exit Admin Mode */}
          <button
            id="exit-admin-mode"
            onClick={handleExitAdmin}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-md shadow-red-900/40"
          >
            <LogOut size={13} />
            Exit Admin Mode
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden z-50 p-2 text-white/70 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(o => !o)}
          aria-label="Toggle admin menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-0 pt-20 bg-[#1C0505] z-40 flex flex-col px-6 overflow-y-auto"
          >
            {/* Admin badge */}
            <div className="flex items-center gap-2 mb-6 pt-2">
              <Shield size={14} className="text-red-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-400">Admin Mode Active</span>
            </div>

            <div className="flex flex-col gap-1">
              {ADMIN_NAV.map(({ name, path, icon: Icon }) => (
                <Link
                  key={name}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 py-3 px-4 text-base font-medium rounded-xl transition-colors ${
                    isActive(path)
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  {name}
                </Link>
              ))}
            </div>

            <div className="mt-auto mb-10 pt-6 border-t border-white/10 space-y-3">
              {currentUser && (
                <div className="flex items-center gap-3 px-2 mb-2">
                  <div className="w-9 h-9 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-red-400">A</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white/80">Admin</p>
                    <p className="text-xs text-white/30">{currentUser.email}</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => { setMobileMenuOpen(false); handleExitAdmin(); }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-lg"
              >
                <LogOut size={18} /> Exit Admin Mode
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
