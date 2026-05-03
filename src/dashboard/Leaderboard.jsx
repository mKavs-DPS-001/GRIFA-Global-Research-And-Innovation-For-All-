import React from 'react';
import { LEADERBOARD } from './data';
import { Trophy } from 'lucide-react';

export default function Leaderboard() {
  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ background: '#FEF3C7', color: '#D97706', padding: 12, borderRadius: 12 }}>
          <Trophy size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0B1F3A', margin: '0 0 4px' }}>Leaderboard</h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Earn points by completing pipeline stages and tasks.</p>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>Rank</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>Researcher</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 }}>Plan</th>
              <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'right' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {LEADERBOARD.map((user, i) => (
              <tr key={user.rank} style={{ 
                borderBottom: i !== LEADERBOARD.length - 1 ? '1px solid #F1F5F9' : 'none',
                background: user.isMe ? '#EFF6FF' : 'transparent'
              }}>
                <td style={{ padding: '16px 24px', fontSize: 15, fontWeight: 800, color: user.rank <= 3 ? '#D97706' : '#64748B' }}>
                  #{user.rank}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: user.isMe ? 800 : 600, color: user.isMe ? '#2563EB' : '#0B1F3A' }}>
                      {user.name}
                    </span>
                    {user.badge && <span style={{ fontSize: 16 }}>{user.badge}</span>}
                    {user.isMe && (
                      <span style={{ background: '#2563EB', color: '#fff', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', padding: '2px 6px', borderRadius: 4 }}>
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    background: user.plan === 'Innovator' ? '#F3E8FF' : user.plan === 'Scholar' ? '#E0E7FF' : '#F1F5F9',
                    color: user.plan === 'Innovator' ? '#7E22CE' : user.plan === 'Scholar' ? '#4338CA' : '#475569',
                    fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 12
                  }}>
                    {user.plan}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', fontSize: 16, fontWeight: 800, color: '#0B1F3A', textAlign: 'right' }}>
                  {user.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
