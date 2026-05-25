import React, { useState, useEffect } from 'react';
import {
  collection, onSnapshot, query, orderBy,
  updateDoc, doc, deleteDoc
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { CheckCircle, Archive, Trash2, ExternalLink, MapPin, RefreshCw } from 'lucide-react';

const STATUS_CFG = {
  community: { label: 'Community',      color: '#EF4444', bg: '#FEE2E2' },
  review:    { label: 'Under Review',   color: '#F59E0B', bg: '#FEF3C7' },
  active:    { label: 'Active Research',color: '#10B981', bg: '#D1FAE5' },
  completed: { label: 'Completed',      color: '#3B82F6', bg: '#DBEAFE' },
};

const COLS = [
  { label: '#',        w: 40  },
  { label: 'Title',    w: 220 },
  { label: 'Category', w: 110 },
  { label: 'Location', w: 150 },
  { label: 'Reporter', w: 120 },
  { label: 'Status',   w: 140 },
  { label: 'Date',     w: 120 },
  { label: 'Actions',  w: 200 },
];

function Badge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.community;
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: 20,
      background: cfg.bg,
      color: cfg.color,
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}>
      {cfg.label}
    </span>
  );
}

function PhotoThumb({ url }) {
  if (!url) return <span style={{ color: '#CBD5E1', fontSize: 12 }}>No photo</span>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <img
        src={url}
        alt="report"
        width="40" height="40" loading="lazy"
        style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid #E8EDF5' }}
      />
    </a>
  );
}

export default function CommunityReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fbError, setFbError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    // Safety-net: if onSnapshot never fires (bad credentials / rules),
    // stop the spinner after 10 s and show a helpful error.
    const timeout = setTimeout(() => {
      setLoading(false);
      setFbError(
        'Firebase did not respond within 10 seconds. ' +
        'Check your project credentials in src/firebase/config.js and your Firestore security rules.'
      );
    }, 10000);

    const q = query(collection(db, 'communityReports'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      snap => {
        clearTimeout(timeout);
        setReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setFbError('');
        setLoading(false);
      },
      err => {
        clearTimeout(timeout);
        console.error('Firestore onSnapshot error:', err);
        setFbError(`Firestore error: ${err.message}`);
        setLoading(false);
      }
    );
    return () => { unsub(); clearTimeout(timeout); };
  }, []);

  const setStatus = async (id, status) => {
    await updateDoc(doc(db, 'communityReports', id), { status });
  };

  const archiveReport = async id => {
    await updateDoc(doc(db, 'communityReports', id), { archived: true });
  };

  const deleteReport = async id => {
    if (window.confirm('Permanently delete this report?')) {
      await deleteDoc(doc(db, 'communityReports', id));
    }
  };

  const promote = async id => {
    await updateDoc(doc(db, 'communityReports', id), { status: 'active' });
  };

  const filtered = filterStatus === 'all'
    ? reports.filter(r => !r.archived)
    : reports.filter(r => r.status === filterStatus && !r.archived);

  const archived = reports.filter(r => r.archived);

  const counts = Object.fromEntries(
    ['all', ...Object.keys(STATUS_CFG)].map(k => [
      k,
      k === 'all'
        ? reports.filter(r => !r.archived).length
        : reports.filter(r => r.status === k && !r.archived).length,
    ])
  );

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0B1F3A' }}>Community Reports</h2>
        <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: 14 }}>
          Real-world problems submitted by the community. Promote to active research or archive.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 14, marginBottom: 24 }}>
        {Object.entries({ all: { label: 'Total Active', color: '#0B1F3A', bg: '#EFF6FF' }, ...STATUS_CFG }).map(([key, cfg]) => (
          <div
            key={key}
            onClick={() => setFilterStatus(key)}
            style={{
              padding: '16px',
              background: filterStatus === key ? cfg.bg : '#fff',
              border: `2px solid ${filterStatus === key ? cfg.color : '#E8EDF5'}`,
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 900, color: cfg.color }}>{counts[key] ?? 0}</div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>
              {cfg.label}
            </div>
          </div>
        ))}
        <div style={{ padding: '16px', background: '#fff', border: '2px solid #E8EDF5', borderRadius: 12 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#94A3B8' }}>{archived.length}</div>
          <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>Archived</div>
        </div>
      </div>

      {/* ── Firebase error banner ── */}
      {fbError && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
          <div>
            <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#991B1B', fontSize: 14 }}>Firebase connection failed</p>
            <p style={{ margin: 0, color: '#B91C1C', fontSize: 13, lineHeight: 1.5 }}>{fbError}</p>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#64748B' }}>
          <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto 12px' }} />
          Loading reports…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94A3B8', background: '#fff', borderRadius: 16, border: '1px solid #E8EDF5' }}>
          <MapPin size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
          No reports in this category yet.
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EDF5', overflow: 'hidden' }}>
          {/* Table head */}
          <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 110px 140px 110px 150px 110px 1fr', gap: 0, background: '#F8FAFF', borderBottom: '1px solid #E8EDF5', padding: '10px 16px' }}>
            {COLS.map(c => (
              <div key={c.label} style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {c.label}
              </div>
            ))}
          </div>

          {filtered.map((rep, i) => (
            <React.Fragment key={rep.id}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 110px 140px 110px 150px 110px 1fr',
                  gap: 0,
                  padding: '14px 16px',
                  borderBottom: '1px solid #F1F5F9',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: expandedId === rep.id ? '#F8FAFF' : '#fff',
                  transition: 'background 0.15s',
                }}
                onClick={() => setExpandedId(id => id === rep.id ? null : rep.id)}
              >
                <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0B1F3A', lineHeight: 1.3 }}>{rep.title}</div>
                  <PhotoThumb url={rep.photoUrl} />
                </div>
                <div style={{ fontSize: 12, color: '#475569' }}>{rep.category}</div>
                <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>
                  {rep.lat?.toFixed(4)}, {rep.lng?.toFixed(4)}
                </div>
                <div style={{ fontSize: 12, color: '#475569' }}>{rep.reporterName || 'Anonymous'}</div>
                <div><Badge status={rep.status} /></div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>
                  {rep.createdAt?.toDate?.()?.toLocaleDateString('en-IN') || '—'}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => promote(rep.id)}
                    title="Promote to Active Research"
                    style={actionBtn('#10B981')}
                  >
                    <CheckCircle size={13} /> Promote
                  </button>
                  <select
                    value={rep.status}
                    onChange={e => setStatus(rep.id, e.target.value)}
                    style={{ padding: '5px 8px', borderRadius: 7, border: '1px solid #E2E8F0', fontSize: 12, color: '#0B1F3A', cursor: 'pointer', background: '#F8FAFF' }}
                  >
                    {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <button onClick={() => archiveReport(rep.id)} title="Archive" style={actionBtn('#F59E0B')}>
                    <Archive size={13} />
                  </button>
                  <button onClick={() => deleteReport(rep.id)} title="Delete" style={actionBtn('#EF4444')}>
                    <Trash2 size={13} />
                  </button>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${rep.lat}&mlon=${rep.lng}#map=16/${rep.lat}/${rep.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View on map"
                    style={{ ...actionBtn('#1A56DB'), textDecoration: 'none' }}
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Expanded description */}
              {expandedId === rep.id && (
                <div style={{ padding: '12px 16px 16px 56px', background: '#F8FAFF', borderBottom: '1px solid #E8EDF5' }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.7, maxWidth: 600 }}>
                    {rep.description || 'No description provided.'}
                  </p>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function actionBtn(color) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '5px 9px', borderRadius: 7, border: `1px solid ${color}20`,
    background: `${color}10`, color: color,
    fontSize: 11, fontWeight: 700, cursor: 'pointer',
    whiteSpace: 'nowrap',
  };
}
