import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  collection, addDoc, onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { MapPin, X, Camera, Loader2, CheckCircle, Navigation } from 'lucide-react';

// ─── Fix Leaflet default icon path broken by Vite ────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  community: { label: 'Community Reported', color: '#EF4444', bg: '#FEE2E2', text: '#991B1B' },
  review:    { label: 'Under DPS Review',   color: '#F59E0B', bg: '#FEF3C7', text: '#92400E' },
  active:    { label: 'Active Research',    color: '#10B981', bg: '#D1FAE5', text: '#065F46' },
  completed: { label: 'Completed',          color: '#3B82F6', bg: '#DBEAFE', text: '#1E40AF' },
};

const CATEGORIES = [
  'Environment', 'Health', 'Education', 'Infrastructure',
  'Agriculture', 'Technology', 'Social', 'Other'
];

// ─── Custom colored pin icon ──────────────────────────────────────────────────
function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:28px;height:36px;position:relative;
    ">
      <svg viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z" fill="${color}"/>
        <circle cx="14" cy="13" r="6" fill="white" opacity="0.9"/>
      </svg>
    </div>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -38],
  });
}

// ─── Fly-to helper ────────────────────────────────────────────────────────────
function FlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 14, { duration: 1.2 });
  }, [coords, map]);
  return null;
}

// ─── Report Form Modal ────────────────────────────────────────────────────────
// Timeout-protected write: rejects after `ms` ms if Firebase hangs
function withTimeout(promise, ms = 12000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`TIMEOUT: Firebase did not respond in ${ms / 1000}s. Check your Firebase credentials and Firestore rules.`)), ms)
    ),
  ]);
}

function ReportModal({ latlng, onClose, onSubmitted }) {
  const [form, setForm] = useState({ title: '', category: 'Environment', description: '', reporterName: '' });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState(latlng || null);

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const detectLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!coords) { setError('Please detect your GPS location first.'); return; }
    if (!form.title.trim()) { setError('Problem title is required.'); return; }
    if (!form.description.trim()) { setError('Description is required.'); return; }
    setSubmitting(true);
    try {
      let photoUrl = null;
      if (photo) {
        const fileRef = storageRef(storage, `community-reports/${Date.now()}_${photo.name}`);
        await withTimeout(uploadBytes(fileRef, photo));
        photoUrl = await withTimeout(getDownloadURL(fileRef));
      }
      await withTimeout(
        addDoc(collection(db, 'communityReports'), {
          ...form,
          lat: coords[0],
          lng: coords[1],
          photoUrl,
          status: 'community',
          createdAt: serverTimestamp(),
          archived: false,
        })
      );
      setDone(true);
      setTimeout(() => { onSubmitted(); onClose(); }, 2000);
    } catch (err) {
      console.error('Report submit error:', err);
      setError(
        err.message?.startsWith('TIMEOUT')
          ? 'Firebase timed out. Check your project credentials and Firestore rules, then try again.'
          : `Submission failed: ${err.message || 'Unknown error'}. Check console for details.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inp = (field, placeholder, type = 'text') => (
    <input
      type={type}
      placeholder={placeholder}
      value={form[field]}
      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
      style={inputStyle}
    />
  );

  if (done) return (
    <Overlay>
      <div style={{ ...modalBox, textAlign: 'center', padding: 48 }}>
        <CheckCircle size={56} color="#10B981" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ color: '#0B1F3A', marginBottom: 8 }}>Report Submitted!</h2>
        <p style={{ color: '#64748B' }}>Your pin is now live on the map. Thank you.</p>
      </div>
    </Overlay>
  );

  return (
    <Overlay>
      <div style={{ ...modalBox, maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0B1F3A' }}>Report a Problem</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B' }}>Help GRIFA discover real-world challenges</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Location */}
          <div>
            <label style={labelStyle}>Location *</label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ flex: 1, padding: '10px 14px', background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13, color: coords ? '#0B1F3A' : '#94A3B8' }}>
                {coords ? `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}` : 'No location detected'}
              </div>
              <button
                type="button"
                onClick={detectLocation}
                disabled={locating}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}
              >
                {locating ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Navigation size={14} />}
                {locating ? 'Locating…' : 'Detect GPS'}
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>Problem Title *</label>
            {inp('title', 'e.g. Broken streetlights on NH-48')}
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description *</label>
            <textarea
              placeholder="Describe the problem in detail…"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Photo */}
          <div>
            <label style={labelStyle}>Photo (optional)</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#F8FAFF', border: '1.5px dashed #CBD5E1', borderRadius: 10, cursor: 'pointer' }}>
              <Camera size={18} color="#64748B" />
              <span style={{ fontSize: 13, color: '#64748B' }}>{photo ? photo.name : 'Click to upload photo'}</span>
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
            </label>
            {photoPreview && <img src={photoPreview} alt="preview" width="400" height="160" loading="lazy" style={{ width: '100%', borderRadius: 10, marginTop: 8, maxHeight: 160, objectFit: 'cover' }} />}
          </div>

          {/* Name */}
          <div>
            <label style={labelStyle}>Your Name (optional)</label>
            {inp('reporterName', 'Anonymous')}
          </div>

          {/* Inline error banner */}
          {error && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
              <p style={{ margin: 0, fontSize: 13, color: '#991B1B', lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{ padding: '14px', background: submitting ? '#94A3B8' : 'linear-gradient(135deg, #1A56DB, #2563EB)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 12, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4, transition: 'background 0.2s' }}
          >
            {submitting ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Submitting… (up to 12s)</> : '📍 Submit Report'}
          </button>
        </form>
      </div>
    </Overlay>
  );
}

// ─── Overlay wrapper ──────────────────────────────────────────────────────────
function Overlay({ children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(11,31,58,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      {children}
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const modalBox = { background: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 520, boxShadow: '0 24px 80px rgba(11,31,58,0.25)' };
const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#0B1F3A', background: '#F8FAFF', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' };

// ─── Main ImpactMap Page ──────────────────────────────────────────────────────
export default function ImpactMap() {
  const [pins, setPins]             = useState([]);
  const [showModal, setShowModal]   = useState(false);
  const [flyTo, setFlyTo]           = useState(null);
  const [activeFilter, setFilter]   = useState('all');
  const [loading, setLoading]       = useState(true);

  // Real-time Firestore listener
  useEffect(() => {
    const q = query(collection(db, 'communityReports'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setPins(snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => !p.archived));
      setLoading(false);
    });
    return unsub;
  }, []);

  const filtered = activeFilter === 'all' ? pins : pins.filter(p => p.status === activeFilter);

  const counts = Object.fromEntries(
    Object.keys(STATUS).map(k => [k, pins.filter(p => p.status === k).length])
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFF', fontFamily: "'Inter', sans-serif" }}>
      <Helmet>
        <title>Impact Map | GRIFA</title>
        <meta name="description" content="Community-driven problem reporting map. See real-world challenges reported by citizens and track research progress." />
      </Helmet>

      {/* ── Hero header ── */}
      <div style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #1A3A6B 100%)', padding: '40px 24px 32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24, padding: '6px 16px', marginBottom: 16 }}>
          <MapPin size={14} color="#F59E0B" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live Community Map</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: '0 0 10px', fontFamily: "'Playfair Display', serif" }}>
          Community Impact Map
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', maxWidth: 560, margin: '0 auto 24px' }}>
          Real problems reported by real people. Every pin is a story waiting for a researcher.
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          {Object.entries(STATUS).map(([key, cfg]) => (
            <div key={key} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '8px 18px', minWidth: 90, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: cfg.color }}>{counts[key] || 0}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2 }}>{cfg.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'linear-gradient(135deg, #D97706, #F59E0B)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 4px 20px rgba(217,119,6,0.4)', transition: 'transform 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}
        >
          <MapPin size={18} />
          Report a Problem
        </button>
      </div>

      {/* ── Filter tabs ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8EDF5', padding: '0 24px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {[['all', 'All Pins', '#0B1F3A'], ...Object.entries(STATUS).map(([k, v]) => [k, v.label, v.color])].map(([key, label, color]) => {
          const active = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{ padding: '14px 16px', background: 'none', border: 'none', borderBottom: active ? `3px solid ${color}` : '3px solid transparent', color: active ? color : '#64748B', fontWeight: active ? 700 : 500, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
            >
              {label} {key !== 'all' && <span style={{ opacity: 0.7 }}>({counts[key] || 0})</span>}
            </button>
          );
        })}
      </div>

      {/* ── Map ── */}
      <div style={{ position: 'relative', height: 'calc(100vh - 340px)', minHeight: 420 }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFF', zIndex: 10 }}>
            <Loader2 size={32} color="#1A56DB" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {flyTo && <FlyTo coords={flyTo} />}

          {filtered.map(pin => {
            const cfg = STATUS[pin.status] || STATUS.community;
            return (
              <Marker
                key={pin.id}
                position={[pin.lat, pin.lng]}
                icon={makeIcon(cfg.color)}
              >
                <Popup maxWidth={300} minWidth={240}>
                  <div style={{ fontFamily: "'Inter', sans-serif", padding: 4 }}>
                    {pin.photoUrl && (
                      <img src={pin.photoUrl} alt={pin.title} width="280" height="140" loading="lazy" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }} />
                    )}
                    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, background: cfg.bg, color: cfg.text, fontSize: 10, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {cfg.label}
                    </span>
                    <h3 style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 800, color: '#0B1F3A', lineHeight: 1.3 }}>{pin.title}</h3>
                    <p style={{ margin: '0 0 8px', fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>
                      {pin.description?.length > 120 ? pin.description.slice(0, 120) + '…' : pin.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#94A3B8', marginBottom: 10 }}>
                      <span>📁 {pin.category}</span>
                      <span>👤 {pin.reporterName || 'Anonymous'}</span>
                    </div>
                    <a
                      href="/plans"
                      style={{ display: 'block', textAlign: 'center', padding: '9px', background: 'linear-gradient(135deg, #1A56DB, #2563EB)', color: '#fff', fontWeight: 700, fontSize: 12, borderRadius: 8, textDecoration: 'none' }}
                    >
                      🔬 I want to research this
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* ── Legend ── */}
      <div style={{ background: '#fff', borderTop: '1px solid #E8EDF5', padding: '16px 24px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Legend:</span>
        {Object.entries(STATUS).map(([, cfg]) => (
          <div key={cfg.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: cfg.color }} />
            <span style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {showModal && (
        <ReportModal
          onClose={() => setShowModal(false)}
          onSubmitted={() => {}}
        />
      )}
    </div>
  );
}
