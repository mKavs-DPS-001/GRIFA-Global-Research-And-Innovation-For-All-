import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, Bookmark, Calendar, UserCheck } from 'lucide-react';
import { STUDENT, SAVED_PROBLEMS, ACTIVITY } from './data';
import Pipeline from './Pipeline';

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div style={{ background: '#0B1F3A', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ background: color, padding: 10, borderRadius: 10, color: '#0B1F3A', display: 'flex' }}>
        <Icon size={20} />
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', margin: '0 0 2px' }}>{title}</p>
        <p style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>{value}</p>
      </div>
    </div>
  );
}

export default function Overview() {
  const { currentUser } = useAuth();
  const firstName = currentUser?.displayName?.split(' ')[0] || currentUser?.email?.split('@')[0] || 'Researcher';

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0B1F3A', margin: '0 0 4px' }}>
          {greeting}, {firstName}! 👋
        </h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
          Here's your research summary for today.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard title="Current Plan" value={STUDENT.plan} icon={Award} color="#FBBF24" />
        <StatCard title="Problems Saved" value={SAVED_PROBLEMS.length} icon={Bookmark} color="#60A5FA" />
        <StatCard title="Days Active" value={STUDENT.daysActive} icon={Calendar} color="#34D399" />
        <StatCard 
          title="Mentor Status" 
          value={STUDENT.mentorAssigned ? "Connected" : "Not Assigned"} 
          icon={UserCheck} 
          color={STUDENT.mentorAssigned ? "#34D399" : "#94A3B8"} 
        />
      </div>

      {/* Pipeline Preview */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0B1F3A', marginBottom: 16 }}>Current Stage</h2>
        {/* We reuse the Pipeline component but we could pass a prop to make it compact if needed. 
            For now, just render the Pipeline component to show the current stage clearly. */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: 24 }}>
          <Pipeline compact={true} />
        </div>
      </div>

      {/* Activity Feed */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0B1F3A', marginBottom: 16 }}>Recent Activity</h2>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', padding: '12px 0' }}>
          {ACTIVITY.map((act, i) => (
            <div key={act.id} style={{ 
              display: 'flex', alignItems: 'center', gap: 16, padding: '12px 24px',
              borderBottom: i !== ACTIVITY.length - 1 ? '1px solid #F1F5F9' : 'none'
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: act.color }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0B1F3A', margin: '0 0 2px' }}>{act.text}</p>
                <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
