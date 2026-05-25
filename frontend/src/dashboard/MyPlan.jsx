import React from 'react';
import { STUDENT, ALL_PLANS } from './data';
import { Check, ArrowRight, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyPlan() {
  const currentPlanIndex = ALL_PLANS.findIndex(p => p.name === STUDENT.plan);
  const currentPlanDetails = ALL_PLANS[currentPlanIndex];
  const upgradePlans = ALL_PLANS.slice(currentPlanIndex + 1);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0B1F3A', margin: '0 0 4px' }}>My Research Plan</h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>You are on the {STUDENT.plan} plan.</p>
      </div>

      {/* Current Plan Card */}
      <div style={{ background: '#0B1F3A', borderRadius: 16, padding: 32, marginBottom: 40, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, color: '#FBBF24' }}>
          <Award size={200} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ background: '#FBBF24', color: '#0B1F3A', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, padding: '4px 12px', borderRadius: 20 }}>
              {STUDENT.plan}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 40, marginBottom: 32 }}>
            <div>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 4px' }}>Price Paid</p>
              <p style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>₹{STUDENT.planPrice}</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 4px' }}>Enrolled</p>
              <p style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{STUDENT.enrolledDate}</p>
            </div>
          </div>
          
          <h3 style={{ fontSize: 14, color: '#94A3B8', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Included Features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
            {currentPlanDetails.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Check size={16} color="#34D399" />
                <span style={{ fontSize: 14, color: '#E2E8F0' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrades */}
      {upgradePlans.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0B1F3A', marginBottom: 16 }}>Upgrade Your Research</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {upgradePlans.map(plan => (
              <div key={plan.id} style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0B1F3A', margin: '0 0 4px' }}>{plan.name}</h3>
                <p style={{ fontSize: 20, fontWeight: 700, color: '#2563EB', margin: '0 0 20px' }}>₹{plan.price}</p>
                
                <div style={{ flex: 1, marginBottom: 24 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: 12 }}>Unlocks:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {plan.features.slice(-3).map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <Check size={14} color="#2563EB" style={{ marginTop: 2 }} />
                        <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.4 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link to="/plans" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#EFF6FF', color: '#2563EB', textDecoration: 'none', padding: '10px', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>
                  Upgrade Plan <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
