import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Star, BarChart2, Download, Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import purchaseData from '../data/purchaseData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const INR = (n) =>
  '₹' + n.toLocaleString('en-IN');

const TIER_ORDER = ['Explorer', 'Analyst', 'Researcher', 'Scholar', 'Innovator'];

const TIER_COLORS = {
  Explorer:   { bg: 'bg-sky-100',    text: 'text-sky-700',    bar: '#38BDF8' },
  Analyst:    { bg: 'bg-accent-light', text: 'text-accent',   bar: '#1A56DB' },
  Researcher: { bg: 'bg-violet-100', text: 'text-violet-700', bar: '#7C3AED' },
  Scholar:    { bg: 'bg-amber-100',  text: 'text-amber-700',  bar: '#D97706' },
  Innovator:  { bg: 'bg-green-100',  text: 'text-green-700',  bar: '#059669' },
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, sub, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-primary rounded-2xl p-6 text-neutral-white flex items-start gap-4 border border-white/5 shadow-lg"
     viewport={{ once: true }}>
      <div className="p-2.5 bg-white/10 rounded-xl shrink-0">
        <Icon size={20} className="text-accent-light" />
      </div>
      <div>
        <p className="text-neutral-white/50 text-xs font-semibold uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-playfair font-bold text-neutral-white leading-none">{value}</p>
        {sub && <p className="text-xs text-neutral-white/40 mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ─── Tier Bar ─────────────────────────────────────────────────────────────────

function TierBar({ tier, count, total, price }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const widthPct = total > 0 ? (count / total) * 100 : 0;
  const colors = TIER_COLORS[tier] || { bar: '#1A56DB' };

  return (
    <div className="flex items-center gap-4 group">
      <div className="w-28 shrink-0">
        <p className="font-bold text-primary text-sm">{tier}</p>
        <p className="text-xs text-neutral-gray">{INR(price)}</p>
      </div>
      <div className="flex-1 bg-neutral-offwhite rounded-full h-8 overflow-hidden border border-neutral-border/30">
        <motion.div initial={{ width: 0 }}
          whileInView={{ width: `${widthPct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full flex items-center justify-end pr-3 min-w-[2rem]"
          style={{ backgroundColor: colors.bar }}
         viewport={{ once: true }}>
          {count > 0 && (
            <span className="text-white text-xs font-bold whitespace-nowrap">{count}</span>
          )}
        </motion.div>
      </div>
      <div className="w-16 text-right shrink-0">
        <span className="text-sm font-bold text-primary">{pct}%</span>
        <p className="text-xs text-neutral-gray">{count} enrolled</p>
      </div>
    </div>
  );
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <ChevronsUpDown size={13} className="text-neutral-gray/40" />;
  return sortDir === 'asc'
    ? <ChevronUp size={13} className="text-accent" />
    : <ChevronDown size={13} className="text-accent" />;
}

// ─── Export CSV ───────────────────────────────────────────────────────────────

function exportCSV(data) {
  const headers = ['#', 'Name', 'Email', 'Tier', 'Amount Paid (₹)', 'Date', 'Status'];
  const rows = data.map(r => [r.id, r.name, r.email, r.tier, r.price, r.date, r.status]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'grifa_enrollments.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main AdminDashboard ──────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [search, setSearch]   = useState('');
  const [sortCol, setSortCol] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  // ── KPIs ──
  const totalRevenue     = purchaseData.reduce((s, r) => s + r.price, 0);
  const totalEnrollments = purchaseData.length;
  const tierCounts       = purchaseData.reduce((acc, r) => { acc[r.tier] = (acc[r.tier] || 0) + 1; return acc; }, {});
  const mostPopularTier  = Object.entries(tierCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  const avgPlanValue     = totalEnrollments > 0 ? Math.round(totalRevenue / totalEnrollments) : 0;

  // ── Tier Breakdown ──
  const tierPrices = { Explorer: 99, Analyst: 999, Researcher: 2999, Scholar: 4999, Innovator: 29999 };

  // ── Table ──
  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return purchaseData.filter(r =>
      r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
    );
  }, [search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (sortCol === 'price') { av = Number(av); bv = Number(bv); }
      if (sortCol === 'tier')  { av = TIER_ORDER.indexOf(av); bv = TIER_ORDER.indexOf(bv); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortCol, sortDir]);

  const Th = ({ col, label }) => (
    <th
      onClick={() => handleSort(col)}
      className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-neutral-gray cursor-pointer hover:text-primary select-none transition-colors"
    >
      <span className="inline-flex items-center gap-1">
        {label} <SortIcon col={col} sortCol={sortCol} sortDir={sortDir} />
      </span>
    </th>
  );

  return (
    <div className="min-h-screen bg-neutral-offwhite pb-16" style={{ paddingTop: '70px' }}>
      <Helmet>
        <title>Admin Dashboard | GRIFA</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-7xl">

        {/* Page Header */}
        <div className="mb-10 pt-6">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 className="text-4xl font-playfair font-bold text-primary">Tier Purchase Insights</h1>
          <p className="text-neutral-gray mt-2 text-sm">Live overview of enrollments, revenue, and plan distribution.</p>
        </div>

        {/* ── SECTION 1: KPI Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <KpiCard icon={TrendingUp}  label="Total Revenue"        value={INR(totalRevenue)}         sub={`${totalEnrollments} transactions`}  delay={0}    />
          <KpiCard icon={Users}       label="Total Enrollments"    value={totalEnrollments}           sub="across all tiers"                    delay={0.07} />
          <KpiCard icon={Star}        label="Most Popular Tier"    value={mostPopularTier}            sub={`${tierCounts[mostPopularTier]} enrollments`} delay={0.14} />
          <KpiCard icon={BarChart2}   label="Avg. Plan Value"      value={INR(avgPlanValue)}          sub="per enrollment"                      delay={0.21} />
        </div>

        {/* ── SECTION 2: Tier Breakdown ── */}
        <div className="bg-neutral-white rounded-3xl border border-neutral-border/50 shadow-sm p-8 mb-8">
          <h2 className="text-xl font-playfair font-bold text-primary mb-6 flex items-center gap-2">
            <BarChart2 size={20} className="text-accent" /> Tier Breakdown
          </h2>
          <div className="space-y-5">
            {TIER_ORDER.map(tier => (
              <TierBar
                key={tier}
                tier={tier}
                count={tierCounts[tier] || 0}
                total={totalEnrollments}
                price={tierPrices[tier]}
              />
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-neutral-border/30 grid grid-cols-2 sm:grid-cols-5 gap-4">
            {TIER_ORDER.map(tier => {
              const colors = TIER_COLORS[tier] || {};
              return (
                <div key={tier} className={`rounded-xl p-3 text-center ${colors.bg || 'bg-neutral-offwhite'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider ${colors.text || 'text-primary'}`}>{tier}</p>
                  <p className={`text-2xl font-playfair font-bold ${colors.text || 'text-primary'}`}>{tierCounts[tier] || 0}</p>
                  <p className="text-xs text-neutral-gray mt-0.5">{INR(tierPrices[tier])}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 3: Enrollments Table ── */}
        <div className="bg-neutral-white rounded-3xl border border-neutral-border/50 shadow-sm overflow-hidden">
          {/* Table Header Row */}
          <div className="p-6 border-b border-neutral-border/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-playfair font-bold text-primary flex items-center gap-2">
              <Users size={20} className="text-accent" /> Enrollments
              <span className="ml-2 text-sm font-normal text-neutral-gray bg-neutral-offwhite border border-neutral-border/50 px-2.5 py-0.5 rounded-full">
                {sorted.length} of {totalEnrollments}
              </span>
            </h2>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray" />
                <input
                  type="text"
                  placeholder="Search name or email…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-4 py-2 text-sm rounded-xl border border-neutral-border bg-neutral-offwhite focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent w-52"
                />
              </div>
              {/* Export */}
              <button
                onClick={() => exportCSV(sorted)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-light transition-colors shadow-sm"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-neutral-offwhite border-b border-neutral-border/30">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-neutral-gray w-10">#</th>
                  <Th col="name"  label="Name" />
                  <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-neutral-gray">Email</th>
                  <Th col="tier"  label="Tier" />
                  <Th col="price" label="Amount" />
                  <Th col="date"  label="Date" />
                  <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-neutral-gray">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border/30">
                {sorted.map((row, i) => {
                  const tc = TIER_COLORS[row.tier] || { bg: 'bg-neutral-offwhite', text: 'text-primary' };
                  return (
                    <motion.tr key={row.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-neutral-offwhite/60 transition-colors"
                     viewport={{ once: true }}>
                      <td className="py-3.5 px-4 text-xs text-neutral-gray font-mono">{row.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-primary text-sm">{row.name}</td>
                      <td className="py-3.5 px-4 text-neutral-gray text-sm">{row.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${tc.bg} ${tc.text}`}>
                          {row.tier}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-primary text-sm tabular-nums">{INR(row.price)}</td>
                      <td className="py-3.5 px-4 text-neutral-gray text-sm tabular-nums">{row.date}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          ✓ {row.status}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-neutral-gray text-sm">
                      No results for "{search}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t border-neutral-border/30 bg-neutral-offwhite/50 flex items-center justify-between text-xs text-neutral-gray">
            <span>Showing {sorted.length} enrollment{sorted.length !== 1 ? 's' : ''}</span>
            <span>Total collected: <strong className="text-primary">{INR(sorted.reduce((s, r) => s + r.price, 0))}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
