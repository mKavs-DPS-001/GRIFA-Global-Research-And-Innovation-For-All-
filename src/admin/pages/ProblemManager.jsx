import React, { useState } from 'react';
import { Plus, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';

const INIT_PROBLEMS = [
  { id: 'speed-breakers', title: 'Newtonian Fluid Alternative to Asphalt Speed Breakers', category: 'Physics', views: 1250, status: 'Active',   featured: true  },
  { id: 'bus-stand',      title: 'Safe & Budget-Friendly Snacks at Bus Stands',           category: 'Business', views: 840,  status: 'Active',   featured: false },
  { id: 'open-urination', title: 'Interdisciplinary Solutions to Open Urination',          category: 'Psychology', views: 2100, status: 'Active', featured: false },
  { id: 'stray-dogs',     title: 'Humane Management of Urban Stray Dog Populations',       category: 'Zoology',    views: 3420, status: 'Active', featured: true  },
  { id: 'language-barrier', title: 'Overcoming Medical Language Barriers in Rural Clinics', category: 'Medicine', views: 950, status: 'Draft',   featured: false },
  { id: 'smart-farming',  title: 'Low-Cost Soil Moisture Sensors for Subsistence Farmers', category: 'Agriculture', views: 1800, status: 'Active', featured: false },
];

const STATUS_STYLE = {
  Active:   { bg: '#D1FAE5', color: '#065F46' },
  Archived: { bg: '#F1F5F9', color: '#64748B' },
  Draft:    { bg: '#FEF3C7', color: '#92400E' },
};

const BLANK = { title: '', description: '', category: '', tags: '' };

export default function ProblemManager() {
  const [problems, setProblems]   = useState(INIT_PROBLEMS);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(null); // problem being edited
  const [newData, setNewData]     = useState(BLANK);
  const [toast, setToast]         = useState('');
  const [confirmId, setConfirmId] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const archive = (id) => {
    setProblems(p => p.map(pr => pr.id === id ? { ...pr, status: 'Archived' } : pr));
    showToast('Problem archived.');
  };

  const toggleFeatured = (id) => {
    setProblems(p => p.map(pr => pr.id === id ? { ...pr, featured: !pr.featured } : pr));
  };

  const deleteProblem = (id) => {
    setProblems(p => p.filter(pr => pr.id !== id));
    setConfirmId(null); showToast('Problem deleted.');
  };

  const saveEdit = () => {
    setProblems(p => p.map(pr => pr.id === editModal.id ? { ...pr, title: editModal.title, category: editModal.category } : pr));
    setEditModal(null); showToast('Problem updated.');
  };

  const addProblem = () => {
    if (!newData.title.trim()) return;
    setProblems(p => [...p, { id: Date.now().toString(), ...newData, views: 0, status: 'Draft', featured: false }]);
    setNewData(BLANK); setShowModal(false); showToast('Problem added.');
  };

  const inp = (val, onChange, placeholder = '') => (
    <input value={val} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ padding: '7px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' }} />
  );

  return (
    <div>
      {toast && <div style={{ position: 'fixed', top: 24, right: 24, background: '#0B1F3A', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 9999 }}>{toast}</div>}

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EDF5', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #E8EDF5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0B1F3A', margin: 0 }}>Research Problem Manager</h3>
            <p style={{ fontSize: 12, color: '#94A3B8', margin: '3px 0 0' }}>Control which problems are visible, featured, or archived.</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            <Plus size={15} /> Add Problem
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 750 }}>
            <thead style={{ background: '#F8FAFF' }}>
              <tr>
                {['#', 'Title', 'Category', 'Views', 'Status', 'Featured', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {problems.map((pr, i) => {
                const sc = STATUS_STYLE[pr.status] || STATUS_STYLE.Active;
                return (
                  <tr key={pr.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#94A3B8' }}>{i + 1}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0B1F3A', maxWidth: 240 }}>{pr.title}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748B' }}>{pr.category}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#0B1F3A' }}>{pr.views.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{pr.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => toggleFeatured(pr.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: pr.featured ? '#1A56DB' : '#94A3B8' }}>
                        {pr.featured ? <ToggleRight size={22} color="#1A56DB" /> : <ToggleLeft size={22} color="#CBD5E1" />}
                        {pr.featured ? 'Featured' : 'Off'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {pr.status !== 'Archived' && (
                          <button onClick={() => archive(pr.id)} style={{ padding: '5px 10px', background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Archive</button>
                        )}
                        <button onClick={() => setEditModal({ ...pr })} style={{ padding: '5px 10px', background: '#DBEAFE', color: '#1D4ED8', border: '1px solid #93C5FD', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => setConfirmId(pr.id)} style={{ padding: '5px 10px', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Delete */}
      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 360, textAlign: 'center' }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#0B1F3A', marginBottom: 8 }}>Delete this problem?</p>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => deleteProblem(confirmId)} style={{ padding: '10px 24px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
              <button onClick={() => setConfirmId(null)} style={{ padding: '10px 20px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: 480, maxWidth: '95vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0B1F3A' }}>Edit Problem</h3>
              <button onClick={() => setEditModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[{ label: 'Title', key: 'title' }, { label: 'Category', key: 'category' }].map(({ label, key }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input value={editModal[key]} onChange={e => setEditModal(p => ({ ...p, [key]: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={saveEdit} style={{ flex: 1, padding: 11, background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
              <button onClick={() => setEditModal(null)} style={{ padding: '11px 20px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: 480, maxWidth: '95vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0B1F3A' }}>Add Problem</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[{ label: 'Title', key: 'title' }, { label: 'Category', key: 'category' }, { label: 'Tags (comma separated)', key: 'tags' }].map(({ label, key }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>{label}</label>
                  {inp(newData[key], v => setNewData(p => ({ ...p, [key]: v })))}
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>Description</label>
                <textarea value={newData.description} onChange={e => setNewData(p => ({ ...p, description: e.target.value }))}
                  rows={3} style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={addProblem} style={{ flex: 1, padding: 11, background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Add Problem</button>
              <button onClick={() => setShowModal(false)} style={{ padding: '11px 20px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
