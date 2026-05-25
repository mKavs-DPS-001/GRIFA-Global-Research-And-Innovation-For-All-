import React from 'react';
import { SAVED_PROBLEMS } from './data';
import { GripVertical, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function KanbanColumn({ title, count, children }) {
  return (
    <div style={{ background: '#F1F5F9', borderRadius: 12, padding: 16, minHeight: 300 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, color: '#64748B', margin: 0 }}>
          {title}
        </h3>
        <span style={{ background: '#E2E8F0', color: '#475569', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12 }}>
          {count}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

function ProblemCard({ problem }) {
  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 16, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ cursor: 'grab', color: '#CBD5E1', marginTop: 2 }}>
          <GripVertical size={16} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, padding: '2px 8px', borderRadius: 12, background: `${problem.color}15`, color: problem.color, marginBottom: 8 }}>
            {problem.category}
          </div>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0B1F3A', margin: '0 0 12px', lineHeight: 1.4 }}>
            {problem.title}
          </h4>
          <Link to="/problems/1" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#2563EB', textDecoration: 'none' }}>
            View Problem <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SavedProblems() {
  const interested = SAVED_PROBLEMS.filter(p => p.col === 'interested');
  const exploring = SAVED_PROBLEMS.filter(p => p.col === 'exploring');
  const researching = SAVED_PROBLEMS.filter(p => p.col === 'researching');

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0B1F3A', margin: '0 0 4px' }}>Saved Problems</h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Problems you're exploring or actively researching.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
        <KanbanColumn title="🔖 Interested" count={interested.length}>
          {interested.map(p => <ProblemCard key={p.id} problem={p} />)}
        </KanbanColumn>
        <KanbanColumn title="🔍 Exploring" count={exploring.length}>
          {exploring.map(p => <ProblemCard key={p.id} problem={p} />)}
        </KanbanColumn>
        <KanbanColumn title="🧪 Researching" count={researching.length}>
          {researching.map(p => <ProblemCard key={p.id} problem={p} />)}
        </KanbanColumn>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to="/problems" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E2E8F0', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#0B1F3A', textDecoration: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          Browse More Problems <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
