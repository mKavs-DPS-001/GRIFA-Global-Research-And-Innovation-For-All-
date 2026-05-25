import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from 'next-themes';

// Admin portal (completely separate app)
const AdminPortal = lazy(() => import('./admin/AdminPortal'));

// User-facing components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
// AdminToggle removed — admin access is now Firestore-controlled only

// User-facing pages
const Home = lazy(() => import('./pages/Home'));
const Problems = lazy(() => import('./pages/Problems'));
const ProblemDetail = lazy(() => import('./pages/ProblemDetail'));
const Plans = lazy(() => import('./pages/Plans'));
const Roles = lazy(() => import('./pages/Roles'));
const Scientists = lazy(() => import('./pages/Scientists'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Gallery = lazy(() => import('./pages/Gallery'));
const ProjectTracker = lazy(() => import('./pages/ProjectTracker'));
const ImpactMap = lazy(() => import('./pages/ImpactMap'));
const Login = lazy(() => import('./pages/Login'));

// ─── Maintenance Page ──────────────────────────────────────────────────────────

function MaintenancePage({ maintenance }) {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const endDt = new Date(`${maintenance.endDate}T${maintenance.endTime}`);

    const tick = () => {
      const diff = endDt - Date.now();
      if (diff <= 0) {
        setCountdown('00:00:00');
        return;
      }
      const totalSec = Math.floor(diff / 1000);
      const hh = String(Math.floor(totalSec / 3600)).padStart(2, '0');
      const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
      const ss = String(totalSec % 60).padStart(2, '0');
      setCountdown(`${hh}:${mm}:${ss}`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [maintenance.endDate, maintenance.endTime]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0B1F3A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      textAlign: 'center',
    }}>
      {/* Icon */}
      <div style={{ fontSize: 72, marginBottom: 24, lineHeight: 1 }}>🔧</div>

      {/* Heading */}
      <h1 style={{ fontSize: 36, fontWeight: 800, color: '#FFFFFF', margin: '0 0 14px', letterSpacing: -0.5 }}>
        Under Maintenance
      </h1>

      {/* Custom message */}
      <p style={{ fontSize: 16, color: '#94A3B8', maxWidth: 480, lineHeight: 1.7, margin: '0 0 32px' }}>
        {maintenance.message}
      </p>

      {/* Expected back box */}
      <div style={{
        padding: '18px 32px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 14,
        marginBottom: 28,
      }}>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Expected back
        </p>
        <p style={{ fontSize: 17, color: '#E2E8F0', fontWeight: 700, margin: 0 }}>
          {maintenance.endDate} at {maintenance.endTime}
        </p>
      </div>

      {/* Countdown */}
      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 48,
        fontWeight: 800,
        color: '#1A56DB',
        letterSpacing: 4,
        marginBottom: 48,
        textShadow: '0 0 20px rgba(26,86,219,0.4)',
      }}>
        {countdown}
      </div>

      {/* Footer */}
      <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>
        GRIFA by DPSP · For urgent queries:{' '}
        <a href="mailto:info@grifa.in" style={{ color: '#60A5FA', textDecoration: 'none' }}>info@grifa.in</a>
      </p>
    </div>
  );
}

// ─── User App ──────────────────────────────────────────────────────────────────

function UserApp() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Suspense fallback={<div style={{ height: '100vh', background: '#F8FAFF' }}></div>}>
            <Routes>
              <Route path="/"              element={<Home />}           />
              <Route path="/problems"      element={<Problems />}       />
              <Route path="/problems/:id"  element={<ProblemDetail />}  />
              <Route path="/plans"         element={<Plans />}          />
              <Route path="/roles"         element={<Roles />}          />
              <Route path="/scientists"    element={<Scientists />}     />
              <Route path="/dashboard"     element={<Dashboard />}      />
              <Route path="/contact"       element={<Contact />}        />
              <Route path="/about"         element={<About />}          />
              <Route path="/gallery"       element={<Gallery />}        />
              <Route path="/projects"      element={<ProjectTracker />} />
              <Route path="/impact-map"    element={<ImpactMap />}      />
              <Route path="/login"         element={<Login />}          />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppButton />
      {/* AdminToggle removed for security — admin role set via Firestore /adminRoles/{uid} */}
    </div>
  );
}

// ─── Root App ──────────────────────────────────────────────────────────────────

function AppRoot() {
  const { isAdmin, authReady, maintenanceActive } = useAuth();

  // While Firebase auth resolves — show a matching-height navy bar (no flash)
  if (!authReady) {
    return <div style={{ height: '100vh', background: '#0B1F3A' }} />;
  }

  // Admin portal — completely replaces the user app
  if (isAdmin) return (
    <Suspense fallback={<div style={{ height: '100vh', background: '#F8FAFF' }}></div>}>
      <AdminPortal />
    </Suspense>
  );

  // Check if maintenance window is currently active
  if (maintenanceActive) {
    const now   = Date.now();
    const start = new Date(`${maintenanceActive.startDate}T${maintenanceActive.startTime}`).getTime();
    const end   = new Date(`${maintenanceActive.endDate}T${maintenanceActive.endTime}`).getTime();
    if (now >= start && now < end) {
      return <MaintenancePage maintenance={maintenanceActive} />;
    }
  }

  // Normal user-facing site
  return <UserApp />;
}

// ─── App (provides context + router) ──────────────────────────────────────────

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <HelmetProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <AppRoot />
          </Router>
        </AuthProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}
