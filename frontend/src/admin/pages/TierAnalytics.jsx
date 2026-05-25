import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import purchaseData from '../../data/purchaseData';

const INR = (n) => 'Rs.' + n.toLocaleString('en-IN');
const TIER_ORDER = ['Explorer', 'Analyst', 'Researcher', 'Scholar', 'Innovator'];
const TIER_CONFIG = {
  Explorer:   { color: '#38BDF8', bg: '#E0F2FE', text: '#0369A1', price: 99    },
  Analyst:    { color: '#1A56DB', bg: '#DBEAFE', text: '#1D4ED8', price: 999   },
  Researcher: { color: '#7C3AED', bg: '#EDE9FE', text: '#6D28D9', price: 2999  },
  Scholar:    { color: '#D97706', bg: '#FEF3C7', text: '#B45309', price: 4999  },
  Innovator:  { color: '#059669', bg: '#D1FAE5', text: '#065F46', price: 29999 },
};

export default function TierAnalytics() {
  const totalRevenue     = purchaseData.reduce((s, r) => s + r.price, 0);
  const totalEnrollments = purchaseData.length;
  const tierCounts       = purchaseData.reduce((acc, r) => { acc[r.tier] = (acc[r.tier] || 0) + 1; return acc; }, {});
  const tierRevenue      = purchaseData.reduce((acc, r) => { acc[r.tier] = (acc[r.tier] || 0) + r.price; return acc; }, {});

  return (
    <div>
      {/* Revenue per tier cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 24 }}>
        {TIER_ORDER.map((tier, i) => {
          const c = TIER_CONFIG[tier];
          const count = tierCounts[tier] || 0;
          const rev = tierRevenue[tier] || 0;
          return (
            <motion.div key={tier} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              style={{ background: '#fff', borderRadius: 14, padding: 18, border: `2px solid ${c.color}20`, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }} viewport={{ once: true }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, marginBottom: 10 }} />
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0B1F3A', margin: '0 0 2px' }}>{tier}</p>
              <p style={{ fontSize: 11, color: '#94A3B8', margin: '0 0 10px' }}>{INR(c.price)} / one-time</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: c.text, margin: '0 0 2px' }}>{count}</p>
              <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>enrollments</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0B1F3A', marginTop: 8 }}>{INR(rev)}</p>
              <p style={{ fontSize: 10, color: '#94A3B8', margin: 0 }}>revenue</p>
            </motion.div>
          );
        })}
      </div>

      {/* Enrollment share bars */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E8EDF5', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0B1F3A', margin: '0 0 20px' }}>Enrollment Share by Tier</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {TIER_ORDER.map(tier => {
            const c = TIER_CONFIG[tier];
            const count = tierCounts[tier] || 0;
            const pct = totalEnrollments > 0 ? (count / totalEnrollments) * 100 : 0;
            return (
              <div key={tier}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ background: c.bg, color: c.text, fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>{tier}</span>
                    <span style={{ fontSize: 12, color: '#64748B' }}>{INR(c.price)}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0B1F3A' }}>{count} enrolled · {Math.round(pct)}%</span>
                </div>
                <div style={{ height: 10, background: '#F1F5F9', borderRadius: 10, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} transition={{ duration: 0.9 }}
                    style={{ height: '100%', background: c.color, borderRadius: 10 }} viewport={{ once: true }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue share bars */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E8EDF5' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0B1F3A', margin: '0 0 20px' }}>Revenue Share by Tier</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {TIER_ORDER.map(tier => {
            const c = TIER_CONFIG[tier];
            const rev = tierRevenue[tier] || 0;
            const pct = totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0;
            return (
              <div key={tier}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0B1F3A' }}>{tier}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0B1F3A' }}>{INR(rev)} · {Math.round(pct)}%</span>
                </div>
                <div style={{ height: 10, background: '#F1F5F9', borderRadius: 10, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} transition={{ duration: 0.9, delay: 0.1 }}
                    style={{ height: '100%', background: c.color, borderRadius: 10 }} viewport={{ once: true }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: '#64748B' }}>Total Revenue</span>
          <strong style={{ color: '#0B1F3A', fontSize: 16 }}>{INR(totalRevenue)}</strong>
        </div>
      </div>
    </div>
  );
}
