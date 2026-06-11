import React, { useState, useEffect, useMemo } from 'react';
import { Download, Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { auth } from '../../firebase/config';

const INR = (n) => '₹' + n.toLocaleString('en-IN');
const TIER_ORDER = ['Explorer', 'Analyst', 'Researcher', 'Scholar', 'Innovator'];
const TIER_COLORS = {
  Explorer:   { bg: '#E0F2FE', text: '#0369A1' },
  Analyst:    { bg: '#DBEAFE', text: '#1D4ED8' },
  Researcher: { bg: '#EDE9FE', text: '#6D28D9' },
  Scholar:    { bg: '#FEF3C7', text: '#B45309' },
  Innovator:  { bg: '#D1FAE5', text: '#065F46' },
};

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <ChevronsUpDown size={12} color="rgba(100,116,139,0.5)" />;
  return sortDir === 'asc' ? <ChevronUp size={12} color="#1A56DB" /> : <ChevronDown size={12} color="#1A56DB" />;
}

function exportCSV(data) {
  const headers = ['#', 'Name', 'Email', 'Tier', 'Amount (Rs)', 'Date', 'Status'];
  const rows = data.map(r => [r.id, r.name, r.email, r.tier, r.price, r.date, r.status]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'grifa_enrollments.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function Enrollments() {
  const [purchaseData, setPurchaseData] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [sortCol, setSortCol]       = useState('date');
  const [sortDir, setSortDir]       = useState('desc');
  const [tierFilter, setTierFilter] = useState('All');

  const getToken = async () => auth.currentUser?.getIdToken();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://grifa.bydps.com'}/api/v1/enrollments/admin/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const formatted = data.data.map(d => ({
            id: d.id,
            name: d.user?.name || 'Unknown',
            email: d.user?.email || 'Unknown',
            tier: d.plan?.name || 'Unknown',
            price: d.amount || 0,
            date: new Date(d.createdAt).toLocaleDateString('en-IN'),
            status: d.status.charAt(0).toUpperCase() + d.status.slice(1)
          }));
          setPurchaseData(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch enrollments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return purchaseData.filter(r =>
      (r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)) &&
      (tierFilter === 'All' || r.tier === tierFilter)
    );
  }, [search, tierFilter]);

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
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{label} <SortIcon col={col} sortCol={sortCol} sortDir={sortDir} /></span>
    </th>
  );

  const totalRevenue = sorted.reduce((s, r) => s + r.price, 0);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Total Enrollments', value: purchaseData.length },
          { label: 'Filtered Results',  value: sorted.length },
          { label: 'Filtered Revenue',  value: INR(totalRevenue) },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: '1px solid #E8EDF5' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', margin: '0 0 6px' }}>{label}</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: '#0B1F3A', margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EDF5', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #E8EDF5', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0B1F3A', margin: 0, marginRight: 'auto' }}>All Enrollments</h3>
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', ...TIER_ORDER].map(t => (
              <button key={t} onClick={() => setTierFilter(t)} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: tierFilter === t ? '#0B1F3A' : '#F1F5F9', color: tierFilter === t ? '#fff' : '#64748B' }}>{t}</button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email…" style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, fontSize: 13, border: '1px solid #E2E8F0', borderRadius: 8, outline: 'none', width: 200 }} />
          </div>
          <button onClick={() => exportCSV(sorted)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#0B1F3A', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <Download size={13} /> Export CSV
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead style={{ background: '#F8FAFF' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }}>#</th>
                <Th col="name" label="Name" /><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }}>Email</th>
                <Th col="tier" label="Tier" /><Th col="price" label="Amount" /><Th col="date" label="Date" />
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748B' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>Loading...</td></tr>}
              {!loading && sorted.map(row => {
                const tc = TIER_COLORS[row.tier] || { bg: '#F1F5F9', text: '#0B1F3A' };
                return (
                  <tr key={row.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#94A3B8' }}>{row.id}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0B1F3A' }}>{row.name}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{row.email}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ background: tc.bg, color: tc.text, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{row.tier}</span></td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#0B1F3A' }}>{INR(row.price)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{row.date}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ background: '#D1FAE5', color: '#065F46', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{row.status}</span></td>
                  </tr>
                );
              })}
              {!loading && sorted.length === 0 && <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>No results.</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94A3B8' }}>
          <span>Showing {sorted.length} of {purchaseData.length}</span>
          <span>Total: <strong style={{ color: '#0B1F3A' }}>{INR(totalRevenue)}</strong></span>
        </div>
      </div>
    </div>
  );
}
