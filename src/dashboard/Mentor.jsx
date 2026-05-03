import React from 'react';
import { MENTOR, STUDENT, ALL_PLANS } from './data';
import { Calendar, Mail, MessageSquare, Lock } from 'lucide-react';

export default function Mentor() {
  const currentPlanIndex = ALL_PLANS.findIndex(p => p.name === STUDENT.plan);
  const researcherPlanIndex = ALL_PLANS.findIndex(p => p.name === 'Researcher');
  
  // Progress is steps toward Researcher (index 2). 
  // If Explorer (0), 0%. If Analyst (1), 50%. If Researcher+ (2+), 100%.
  let progress = 0;
  if (currentPlanIndex >= researcherPlanIndex) progress = 100;
  else if (currentPlanIndex === 1) progress = 50;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0B1F3A', margin: '0 0 4px' }}>My Mentor</h1>
      </div>

      {MENTOR ? (
        <div style={{ maxWidth: 600 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, border: '1px solid #E2E8F0', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, flexShrink: 0 
            }}>
              {MENTOR.initials}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0B1F3A', margin: '0 0 4px' }}>{MENTOR.name}</h2>
              <p style={{ fontSize: 16, color: '#2563EB', fontWeight: 600, margin: '0 0 16px' }}>{MENTOR.institution}</p>
              
              <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#475569' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                    <Calendar size={14} />
                  </div>
                  <strong>Next Session:</strong> {MENTOR.nextSession}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#475569' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                    <Mail size={14} />
                  </div>
                  <strong>Email Support:</strong> Priority Response
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button style={{ flex: 1, padding: '10px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                  <Calendar size={16} /> Book Session
                </button>
                <button style={{ flex: 1, padding: '10px', background: '#fff', color: '#0B1F3A', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                  <MessageSquare size={16} /> Message
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 600, background: '#fff', borderRadius: 16, padding: 40, border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F1F5F9', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0B1F3A', margin: '0 0 12px' }}>Mentor not yet assigned</h2>
          <p style={{ fontSize: 15, color: '#64748B', margin: '0 0 32px', lineHeight: 1.5 }}>
            Your 1-on-1 expert mentor will be assigned once you reach the <strong>Researcher tier</strong> or above.
          </p>

          <div style={{ background: '#F8FAFC', padding: 24, borderRadius: 12, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 700 }}>
              <span style={{ color: '#0B1F3A' }}>Current: {STUDENT.plan}</span>
              <span style={{ color: '#2563EB' }}>Goal: Researcher</span>
            </div>
            <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: '#2563EB', borderRadius: 4 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
