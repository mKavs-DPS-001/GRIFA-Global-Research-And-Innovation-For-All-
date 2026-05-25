import React, { useState } from 'react';
import { JOURNAL_ENTRIES_INIT } from './data';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';

function JournalEntry({ entry, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = entry.text.length > 100;
  const displayText = expanded ? entry.text : (isLong ? entry.text.slice(0, 100) + '...' : entry.text);

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2E8F0', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '4px 10px', borderRadius: 12 }}>
          {entry.date}
        </span>
        <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }} title="Delete entry">
          <Trash2 size={16} />
        </button>
      </div>
      <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, margin: '0 0 12px', whiteSpace: 'pre-wrap' }}>
        {displayText}
      </p>
      {isLong && (
        <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: '#2563EB', cursor: 'pointer' }}>
          {expanded ? 'Read less' : 'Read more'} {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      )}
    </div>
  );
}

export default function Journal() {
  const [entries, setEntries] = useState(JOURNAL_ENTRIES_INIT);
  const [newText, setNewText] = useState('');

  const handleSave = () => {
    if (!newText.trim()) return;
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      text: newText.trim()
    };
    setEntries([newEntry, ...entries]);
    setNewText('');
  };

  const handleDelete = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0B1F3A', margin: '0 0 4px' }}>Research Journal</h1>
        <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Your private notes and thoughts. Only you can see this.</p>
      </div>

      {/* Editor */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2E8F0', marginBottom: 32 }}>
        <textarea 
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder={`Write a new entry for ${new Date().toISOString().split('T')[0]}...`}
          style={{ width: '100%', minHeight: 120, border: 'none', resize: 'vertical', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#0B1F3A' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #F1F5F9', paddingTop: 16, marginTop: 12 }}>
          <button onClick={handleSave} style={{ background: '#2563EB', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Save Entry
          </button>
        </div>
      </div>

      {/* Entries */}
      <div>
        {entries.map(entry => (
          <JournalEntry key={entry.id} entry={entry} onDelete={() => handleDelete(entry.id)} />
        ))}
        {entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>
            No journal entries yet. Start writing above.
          </div>
        )}
      </div>
    </div>
  );
}
