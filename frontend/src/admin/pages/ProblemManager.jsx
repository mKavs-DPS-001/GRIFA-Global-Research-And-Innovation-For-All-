import React, { useState, useEffect } from 'react';
import { Plus, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import { auth } from '../../firebase/config';

const STATUS_STYLE = {
  Active:   { bg: '#D1FAE5', color: '#065F46' },
  Archived: { bg: '#F1F5F9', color: '#64748B' },
  Draft:    { bg: '#FEF3C7', color: '#92400E' },
};

const BLANK = { title: '', description: '', category: '', tags: '' };

export default function ProblemManager() {
  const [problems, setProblems]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(null); // problem being edited
  const [newData, setNewData]     = useState(BLANK);
  const [toast, setToast]         = useState('');
  const [confirmId, setConfirmId] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };
  const getToken = async () => auth.currentUser?.getIdToken();

  const fetchProblems = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://grifa.bydps.com'}/api/v1/problems/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const formatted = data.data.map(p => ({
            ...p,
            status: p.status ? (p.status.charAt(0).toUpperCase() + p.status.slice(1)) : 'Active'
        }));
        setProblems(formatted);
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading problems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProblems(); }, []);

  const archive = async (id) => {
    try {
      const token = await getToken();
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://grifa.bydps.com'}/api/v1/problems/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' })
      });
      setProblems(p => p.map(pr => pr.id === id ? { ...pr, status: 'Archived' } : pr));
      showToast('Problem archived.');
    } catch(e) { showToast('Error archiving problem'); }
  };

  const toggleFeatured = async (id) => {
    const problem = problems.find(p => p.id === id);
    if (!problem) return;
    try {
      const token = await getToken();
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://grifa.bydps.com'}/api/v1/problems/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !problem.featured })
      });
      setProblems(p => p.map(pr => pr.id === id ? { ...pr, featured: !pr.featured } : pr));
    } catch(e) { showToast('Error toggling featured'); }
  };

  const deleteProblem = async (id) => {
    try {
      const token = await getToken();
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://grifa.bydps.com'}/api/v1/problems/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setProblems(p => p.filter(pr => pr.id !== id));
      setConfirmId(null); showToast('Problem deleted.');
    } catch(e) { showToast('Error deleting problem'); }
  };

  const saveEdit = async () => {
    try {
      const token = await getToken();
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://grifa.bydps.com'}/api/v1/problems/${editModal.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editModal.title, category: editModal.category })
      });
      setProblems(p => p.map(pr => pr.id === editModal.id ? { ...pr, title: editModal.title, category: editModal.category } : pr));
      setEditModal(null); showToast('Problem updated.');
    } catch(e) { showToast('Error saving problem'); }
  };

  const addProblem = async () => {
    if (!newData.title.trim()) return;
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://grifa.bydps.com'}/api/v1/problems`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newData, status: 'active', featured: false })
      });
      const data = await res.json();
      if (data.success) {
        const serverDoc = { ...data.data, status: data.data.status.charAt(0).toUpperCase() + data.data.status.slice(1) };
        setProblems(p => [serverDoc, ...p]);
        setNewData(BLANK); setShowModal(false); showToast('Problem added.');
      }
    } catch(e) { showToast('Error adding problem'); }
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
              {loading && <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center' }}>Loading problems...</td></tr>}
              {!loading && problems.map((pr, i) => {
                const sc = STATUS_STYLE[pr.status] || STATUS_STYLE.Active;
                return (
                  <tr key={pr.id} style={{ borderTop: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#94A3B8' }}>{i + 1}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0B1F3A', maxWidth: 240 }}>{pr.title}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748B' }}>{pr.category}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#0B1F3A' }}>{pr.views?.toLocaleString() || 0}</td>
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
