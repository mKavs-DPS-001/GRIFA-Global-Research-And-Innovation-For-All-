import React, { useState } from 'react';
import { Check } from 'lucide-react';

const TIER_PRICES = { Explorer: 99, Analyst: 999, Researcher: 2999, Scholar: 4999, Innovator: 29999 };
const TIER_ORDER  = ['Explorer', 'Analyst', 'Researcher', 'Scholar', 'Innovator'];

const UPGRADE_DELTAS = {
  Explorer:   { Analyst: 900,  Researcher: 2000, Scholar: 2000, Innovator: 25000 },
  Analyst:    { Researcher: 2000, Scholar: 2000, Innovator: 25000 },
  Researcher: { Scholar: 2000, Innovator: 25000 },
  Scholar:    { Innovator: 25000 },
};

const TIER_COLORS = {
  Explorer:   '#38BDF8',
  Analyst:    '#1A56DB',
  Researcher: '#7C3AED',
  Scholar:    '#D97706',
  Innovator:  '#059669',
};

const INR = (n) => 'Rs.' + n.toLocaleString('en-IN');

export default function PlansSimulator() {
  const [ownedTier, setOwnedTier] = useState('');

  const ownedIdx = TIER_ORDER.indexOf(ownedTier);

  return (
    <div>
      {/* Simulator card */}
      <div style={{ background: '#0B1F3A', borderRadius: 16, padding: '24px 28px', marginBottom: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: '0 0 6px' }}>Admin Tool</p>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>Upgrade Price Simulator</h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 20px' }}>
          Simulate what a student who already purchased a tier would see and pay to upgrade.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Viewing pricing for a student who already has:</span>
          <select
            value={ownedTier}
            onChange={e => setOwnedTier(e.target.value)}
            style={{ padding: '9px 14px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, fontSize: 14, outline: 'none', cursor: 'pointer' }}
          >
            <option value="" style={{ background: '#0B1F3A' }}>None — show full prices</option>
            {TIER_ORDER.slice(0, -1).map(t => (
              <option key={t} value={t} style={{ background: '#0B1F3A' }}>{t} ({INR(TIER_PRICES[t])})</option>
            ))}
          </select>
          {ownedTier && (
            <button onClick={() => setOwnedTier('')}
              style={{ padding: '9px 14px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>
              Reset
            </button>
          )}
        </div>
        {ownedTier && (
          <p style={{ fontSize: 12, color: '#93C5FD', marginTop: 14, background: 'rgba(26,86,219,0.15)', padding: '8px 14px', borderRadius: 8, display: 'inline-block' }}>
            This is what a student who already has <strong>{ownedTier}</strong> would see and pay.
          </p>
        )}
      </div>

      {/* Tier cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 }}>
        {TIER_ORDER.map((tier, idx) => {
          const isOwned    = ownedTier && idx <= ownedIdx;
          const hasUpgrade = ownedTier && idx > ownedIdx;
          const upgradePx  = hasUpgrade ? (UPGRADE_DELTAS[ownedTier]?.[tier] ?? null) : null;
          const color      = TIER_COLORS[tier];

          return (
            <div key={tier} style={{
              background: '#fff', borderRadius: 16, padding: 20,
              border: isOwned ? '2px solid #22C55E' : `2px solid ${color}30`,
              opacity: isOwned ? 0.7 : 1,
              position: 'relative',
            }}>
              {isOwned && (
                <div style={{ position: 'absolute', top: -12, right: 12, background: '#22C55E', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em' }}>
                  OWNED ✓
                </div>
              )}
              {hasUpgrade && upgradePx !== null && (
                <div style={{ position: 'absolute', top: -12, left: 12, background: '#22C55E', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                  UPGRADE PRICE
                </div>
              )}

              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, marginBottom: 10 }} />
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8', margin: '0 0 2px' }}>Plan {idx + 1}</p>
              <h4 style={{ fontSize: 18, fontWeight: 800, color: '#0B1F3A', margin: '0 0 12px' }}>{tier}</h4>

              {/* Price display */}
              <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #F1F5F9' }}>
                {hasUpgrade && upgradePx !== null ? (
                  <>
                    <p style={{ fontSize: 12, color: '#94A3B8', textDecoration: 'line-through', margin: '0 0 4px' }}>{INR(TIER_PRICES[tier])}</p>
                    <p style={{ fontSize: 26, fontWeight: 800, color: color, margin: 0, lineHeight: 1 }}>{INR(upgradePx)}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', margin: '3px 0 0' }}>upgrade cost</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 26, fontWeight: 800, color: '#0B1F3A', margin: 0, lineHeight: 1 }}>{INR(TIER_PRICES[tier])}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', margin: '3px 0 0' }}>one-time</p>
                  </>
                )}
              </div>

              <button disabled={isOwned} style={{
                width: '100%', padding: '9px', borderRadius: 10, border: 'none',
                background: isOwned ? '#F1F5F9' : color,
                color: isOwned ? '#94A3B8' : '#fff',
                fontSize: 12, fontWeight: 700, cursor: isOwned ? 'not-allowed' : 'pointer',
              }}>
                {isOwned ? 'Already Enrolled' : hasUpgrade ? `Upgrade — ${INR(upgradePx ?? TIER_PRICES[tier])}` : `Start — ${INR(TIER_PRICES[tier])}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
