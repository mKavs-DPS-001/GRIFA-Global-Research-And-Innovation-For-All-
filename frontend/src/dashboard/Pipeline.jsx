import React from 'react';
import { PIPELINE_STAGES, ACTIVE_STAGE_TASKS } from './data';
import { ArrowRight, CheckCircle2, Circle, Lock } from 'lucide-react';

export default function Pipeline({ compact = false }) {
  const activeStageIndex = PIPELINE_STAGES.findIndex(s => s.status === 'active');
  const activeStage = PIPELINE_STAGES[activeStageIndex];

  const totalTasks = ACTIVE_STAGE_TASKS.length;
  const completedTasks = ACTIVE_STAGE_TASKS.filter(t => t.done).length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div>
      {!compact && (
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0B1F3A', margin: '0 0 4px' }}>Your Research Journey</h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Track your progress from problem selection to publication.</p>
        </div>
      )}

      {/* Stepper */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        marginBottom: 32, overflowX: 'auto', paddingBottom: 8 
      }}>
        {PIPELINE_STAGES.map((stage, i) => (
          <React.Fragment key={stage.id}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 80 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                background: stage.status === 'done' ? '#DCFCE7' : stage.status === 'active' ? '#DBEAFE' : '#F1F5F9',
                color: stage.status === 'done' ? '#16A34A' : stage.status === 'active' ? '#2563EB' : '#94A3B8',
                border: stage.status === 'active' ? '2px solid #2563EB' : '2px solid transparent',
              }}>
                {stage.icon}
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: stage.status === 'active' ? '#2563EB' : '#64748B', textAlign: 'center' }}>
                {stage.name}
              </span>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < activeStageIndex ? '#16A34A' : '#E2E8F0', minWidth: 20 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Active Stage Detail Card */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #2563EB', padding: 24, boxShadow: '0 4px 20px rgba(37, 99, 235, 0.05)' }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0B1F3A', margin: '0 0 8px' }}>
          Current: {activeStage.name}
        </h3>
        <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 24px' }}>
          Gather and analyze existing research on your chosen problem.
        </p>

        {/* Progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#0B1F3A', marginBottom: 8 }}>
            <span>Progress</span>
            <span>{progressPercent}% Complete</span>
          </div>
          <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, background: '#2563EB', borderRadius: 4, transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Tasks */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', marginBottom: 12, letterSpacing: 0.5 }}>Tasks</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ACTIVE_STAGE_TASKS.map(task => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {task.done ? <CheckCircle2 size={18} color="#16A34A" /> : <Circle size={18} color="#CBD5E1" />}
                <span style={{ fontSize: 14, color: task.done ? '#64748B' : '#0B1F3A', textDecoration: task.done ? 'line-through' : 'none' }}>
                  {task.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button style={{ 
          display: 'flex', alignItems: 'center', gap: 8, background: '#2563EB', color: '#fff', 
          border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' 
        }}>
          Continue Research <ArrowRight size={16} />
        </button>
      </div>

      {!compact && (
        <div style={{ marginTop: 24, padding: 16, background: '#F8FAFC', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #E2E8F0' }}>
          <Lock size={16} color="#94A3B8" />
          <span style={{ fontSize: 13, color: '#64748B' }}>
            Stages 3-6 require the <strong>Researcher plan</strong> or above to unlock.
          </span>
        </div>
      )}
    </div>
  );
}
