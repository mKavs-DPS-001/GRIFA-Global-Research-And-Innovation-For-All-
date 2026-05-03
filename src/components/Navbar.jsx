import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, Menu, X, MapPin, Compass } from 'lucide-react';

// ─── Nav structure ────────────────────────────────────────────────────────────

const DIRECT_LINKS = [
  { to: '/',      label: 'Home'  },
  { to: '/about', label: 'About' },
];

const DROPDOWNS = [
  {
    label: 'Research',
    items: [
      { to: '/roles',    label: 'Explore Roles',  desc: 'Find your place in research'  },
      { to: '/problems', label: 'Problems',        desc: 'Browse real-world challenges' },
      { to: '/plans',    label: 'Plans & Pricing', desc: 'Choose your research tier'    },
      { to: '/projects', label: 'Projects',        desc: 'Track ongoing research'       },
    ],
  },
  {
    label: 'Community',
    items: [
      { to: '/impact-map', label: 'Impact Map',  desc: 'Community problem map'       },
      { to: '/scientists', label: 'Scientists',  desc: 'Meet our research experts'   },
      { to: '/gallery',    label: 'Gallery',     desc: 'Research media & highlights' },
    ],
  },
];

// ─── Desktop Dropdown ─────────────────────────────────────────────────────────

function DesktopDropdown({ label, items, scrolled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const isActive = items.some(i => location.pathname === i.to);
  const timerRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center gap-1 px-1 py-2 text-sm font-semibold transition-colors duration-200"
        style={{ color: isActive ? '#60A5FA' : scrolled ? '#1E293B' : 'rgba(255,255,255,0.88)' }}
      >
        {label}
        <ChevronDown
          size={14}
          style={{
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
            opacity: 0.7,
          }}
        />
      </button>

      {/* Dropdown panel */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          minWidth: 220,
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 20px 60px rgba(11,31,58,0.18), 0 4px 16px rgba(11,31,58,0.08)',
          border: '1px solid #E8EDF5',
          padding: '6px',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transform: open
            ? 'translateX(-50%) translateY(0)'
            : 'translateX(-50%) translateY(-8px)',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          zIndex: 200,
        }}
      >
        {/* Arrow tip */}
        <div style={{
          position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)',
          width: 14, height: 7,
          overflow: 'hidden',
        }}>
          <div style={{
            width: 12, height: 12, background: '#fff',
            border: '1px solid #E8EDF5',
            transform: 'rotate(45deg)',
            margin: '3px auto 0',
            borderRadius: 2,
          }} />
        </div>

        {items.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '10px 14px',
                borderRadius: 10,
                textDecoration: 'none',
                background: active ? '#EFF6FF' : 'transparent',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F8FAFF'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: active ? '#1A56DB' : '#0B1F3A' }}>
                {item.label}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748B' }}>{item.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setMobileExpanded(null); }, [location.pathname]);

  const navBg = scrolled
    ? 'rgba(255,255,255,0.97)'
    : 'rgba(11,31,58,0.92)';
  const shadow = scrolled
    ? '0 2px 20px rgba(11,31,58,0.10)'
    : '0 2px 24px rgba(0,0,0,0.22)';
  const logoColor = scrolled ? '#0B1F3A' : '#fff';
  const subLogoColor = scrolled ? '#1A56DB' : 'rgba(255,255,255,0.55)';
  const linkColor = scrolled ? '#1E293B' : 'rgba(255,255,255,0.88)';
  const activeLinkColor = scrolled ? '#1A56DB' : '#60A5FA';
  const borderB = scrolled ? '1px solid #E8EDF5' : '1px solid rgba(255,255,255,0.08)';

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          background: navBg,
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: shadow,
          borderBottom: borderB,
          transition: 'background 0.3s, box-shadow 0.3s, border-color 0.3s',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0, marginRight: 8 }}>
            <div style={{ lineHeight: 1 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: logoColor, letterSpacing: -0.5, fontFamily: "'Playfair Display', serif", transition: 'color 0.3s' }}>
                GRIFA
              </span>
              <span style={{ display: 'block', fontSize: 9, fontWeight: 700, color: subLogoColor, letterSpacing: '0.16em', textTransform: 'uppercase', transition: 'color 0.3s' }}>
                by DPSP
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }} className="hidden md:flex">
            {DIRECT_LINKS.map(l => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{
                    padding: '6px 10px',
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 600,
                    color: active ? activeLinkColor : linkColor,
                    borderRadius: 8,
                    transition: 'color 0.2s',
                  }}
                >
                  {l.label}
                </Link>
              );
            })}

            {DROPDOWNS.map(d => (
              <DesktopDropdown key={d.label} label={d.label} items={d.items} scrolled={scrolled} />
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }} className="hidden md:flex">
            <Link
              to="/impact-map"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #D97706, #F59E0B)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                borderRadius: 10,
                textDecoration: 'none',
                boxShadow: '0 2px 12px rgba(217,119,6,0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(217,119,6,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(217,119,6,0.35)'; }}
            >
              <MapPin size={14} />
              Report a Problem
            </Link>

            <Link
              to="/login"
              style={{
                padding: '8px 18px',
                background: scrolled ? '#1A56DB' : 'rgba(255,255,255,0.12)',
                border: scrolled ? 'none' : '1px solid rgba(255,255,255,0.25)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                borderRadius: 10,
                textDecoration: 'none',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {currentUser ? 'Dashboard' : 'Login'}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden"
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              color: logoColor,
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          style={{
            maxHeight: mobileOpen ? 600 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.35s ease',
            background: '#0B1F3A',
            borderTop: mobileOpen ? '1px solid rgba(255,255,255,0.08)' : 'none',
          }}
          className="md:hidden"
        >
          <div style={{ padding: '12px 16px 20px' }}>
            {/* Direct links */}
            {DIRECT_LINKS.map(l => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  display: 'block',
                  padding: '11px 8px',
                  color: location.pathname === l.to ? '#60A5FA' : 'rgba(255,255,255,0.85)',
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {l.label}
              </Link>
            ))}

            {/* Accordion dropdowns */}
            {DROPDOWNS.map(d => (
              <div key={d.label}>
                <button
                  onClick={() => setMobileExpanded(e => e === d.label ? null : d.label)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '11px 8px',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.85)',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: 'pointer',
                  }}
                >
                  {d.label}
                  <ChevronDown
                    size={16}
                    style={{
                      transform: mobileExpanded === d.label ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                      opacity: 0.6,
                    }}
                  />
                </button>
                <div
                  style={{
                    maxHeight: mobileExpanded === d.label ? 300 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.25s ease',
                  }}
                >
                  {d.items.map(item => (
                    <Link
                      key={item.to}
                      to={item.to}
                      style={{
                        display: 'block',
                        padding: '10px 8px 10px 24px',
                        color: location.pathname === item.to ? '#60A5FA' : 'rgba(255,255,255,0.65)',
                        fontWeight: 600,
                        fontSize: 14,
                        textDecoration: 'none',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Mobile CTAs */}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                to="/impact-map"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #D97706, #F59E0B)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  borderRadius: 10,
                  textDecoration: 'none',
                }}
              >
                <MapPin size={16} />
                Report a Problem
              </Link>
              <Link
                to="/login"
                style={{
                  display: 'block', textAlign: 'center',
                  padding: '12px',
                  background: '#1A56DB',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  borderRadius: 10,
                  textDecoration: 'none',
                }}
              >
                {currentUser ? 'Dashboard' : 'Login'}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content hiding under fixed nav */}
      <div style={{ height: 64 }} />
    </>
  );
}
