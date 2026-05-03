import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Star, BarChart2, Download, Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import purchaseData from '../../data/purchaseData';

const INR = (n) => '₹' + n.toLocaleString('en-IN');

const TIER_ORDER = ['Explorer', 'Analyst', 'Researcher', 'Scholar', 'Innovator'];
const TIER_COLORS = {
  Explorer:   { bg: '#E0F2FE', text: '#0369A1', bar: '#38BDF8' },
  Analyst:    { bg: '#DBEAFE', text: '#1D4ED8', bar: '#1A56DB' },
  Researcher: { bg: '#EDE9FE', text: '#6D28D9', bar: '#7C3AED' },
  Scholar:    { bg: '#FEF3C7', text: '#B45309', bar: '#D97706' },
  Innovator:  { bg: '#D1FAE5', text: '#065F46', bar: '#059669' },
};

function KpiCard({ icon: Icon, label, value, sub, delay = 0, color = '#1A56DB' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: '#0B1F3A', borderRadius: 16, padding: '20px 24px',
        display: 'flex', alignItems: 'flex-start', gap: 16,
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
      viewport={{ once: true }}>
      <div style={{ padding: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 12, flexShrink: 0 }}>
        <Icon size={20} color="#93C5FD" />
      </div>
      <div>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>{label}</p>
        <p style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 4 }}>{sub}</p>}
      </div>
    </motion.div>
  );
}

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <ChevronsUpDown size={12} color="rgba(100,116,139,0.5)" />;
  return sortDir === 'asc' ? <ChevronUp size={12} color="#1A56DB" /> : <ChevronDown size={12} color="#1A56DB" />;
}

function exportCSV(data) {
  const headers = ['#', 'Name', 'Email', 'Tier', 'Amount (₹)', 'Date', 'Status'];
  const rows = data.map(r => [r.id, r.name, r.email, r.tier, r.price, r.date, r.status]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'grifa_enrollments.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function Overview() {
  const [search, setSearch]   = useState('');
  const [sortCol, setSortCol] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const totalRevenue     = purchaseData.reduce((s, r) => s + r.price, 0);
  const totalEnrollments = purchaseData.length;
  const tierCounts       = purchaseData.reduce((acc, r) => { acc[r.tier] = (acc[r.tier] || 0) + 1; return acc; }, {});
  const mostPopularTier  = Object.entries(tierCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  const avgPlanValue     = totalEnrollments > 0 ? Math.round(totalRevenue / totalEnrollments) : 0;
  const tierPrices       = { Explorer: 99, Analyst: 999, Researcher: 2999, Scholar: 4999, Innovator: 29999 };

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return purchaseData.filter(r => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
  }, [search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (sortCol === 'price') { av = Number(av); bv = Number(bv); }
      if (sortCol === 'tier') { av = TIER_ORDER.indexOf(av); bv = TIER_ORDER.indexOf(bv); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortCol, sortDir]);

  const Th = ({ col, label }) => (
    <th onClick={() => handleSort(col)} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {label} <SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />
      </span>
    </th>
  );

  return (
    <div>
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KpiCard icon={TrendingUp} label="Total Revenue"      value={INR(totalRevenue)}    sub={`${totalEnrollments} transactions`} delay={0}    />
        <KpiCard icon={Users}      label="Total Enrollments"  value={totalEnrollments}      sub="across all tiers"                   delay={0.06} />
        <KpiCard icon={Star}       label="Most Popular Tier"  value={mostPopularTier}       sub={`${tierCounts[mostPopularTier]} enrolled`} delay={0.12} />
        <KpiCard icon={BarChart2}  label="Avg Plan Value"     value={INR(avgPlanValue)}     sub="per enrollment"                     delay={0.18} />
      </div>

      {/* Mini Tier Bars */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 20, border: '1px solid #E8EDF5' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0B1F3A', margin: '0 0 16px' }}>Tier Distribution</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TIER_ORDER.map(tier => {
            const count = tierCounts[tier] || 0;
            const pct = totalEnrollments > 0 ? (count / totalEnrollments) * 100 : 0;
            const c = TIER_COLORS[tier];
            return (
              <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 90, fontSize: 12, fontWeight: 600, color: '#0B1F3A', flexShrink: 0 }}>{tier}</div>
                <div style={{ flex: 1, height: 28, background: '#F1F5F9', borderRadius: 6, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    transition={{ duration: 0.8 }}
                    style={{ height: '100%', background: c.bar, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8, minWidth: count > 0 ? 28 : 0 }}
                    viewport={{ once: true }}
                  >
                    {count > 0 && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{count}</span>}
                  </motion.div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', width: 36, textAlign: 'right', flexShrink: 0 }}>{Math.round(pct)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EDF5', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #E8EDF5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0B1F3A', margin: 0 }}>Recent Enrollments</h3>
            <span style={{ background: '#F1F5F9', color: '#64748B', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>{sorted.length}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, fontSize: 13, border: '1px solid #E2E8F0', borderRadius: 8, outline: 'none', width: 200 }} />
            </div>
            <button onClick={() => exportCSV(sorted)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#0B1F3A', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead style={{ background: '#F8FAFF' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B' }}>#</th>
                <Th col="name"  label="Name" />
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B' }}>Email</th>
                <Th col="tier"  label="Tier" />
                <Th col="price" label="Amount" />
                <Th col="date"  label="Date" />
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => {
                const tc = TIER_COLORS[row.tier] || { bg: '#F1F5F9', text: '#0B1F3A' };
                return (
                  <tr key={row.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#94A3B8', fontFamily: 'monospace' }}>{row.id}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0B1F3A' }}>{row.name}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{row.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: tc.bg, color: tc.text, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{row.tier}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#0B1F3A', fontFamily: 'monospace' }}>{INR(row.price)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{row.date}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#D1FAE5', color: '#065F46', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>✓ {row.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94A3B8' }}>
          <span>{sorted.length} enrollment{sorted.length !== 1 ? 's' : ''}</span>
          <span>Total: <strong style={{ color: '#0B1F3A' }}>{INR(sorted.reduce((s, r) => s + r.price, 0))}</strong></span>
        </div>
      </div>
    </div>
  );
}
