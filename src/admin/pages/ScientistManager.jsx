import React, { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';

const INIT_SCIENTISTS = [
  { id: 's1', name: 'Dr. Researcher A', institution: 'IISc Bangalore',   specialization: 'Advanced Materials & Fluid Dynamics',         status: 'Active'  },
  { id: 's2', name: 'Dr. Researcher B', institution: 'GCU',               specialization: 'Environmental Psychology & Urban Behavior',    status: 'Active'  },
  { id: 's3', name: 'Prof. Researcher C', institution: 'REVA University', specialization: 'Sustainable Civil Engineering',                status: 'Pending' },
  { id: 's4', name: 'Dr. Researcher D', institution: 'IIT Bombay',        specialization: 'AI in Healthcare',                            status: 'Active'  },
  { id: 's5', name: 'Prof. Researcher E', institution: 'Oxford University',specialization: 'Computational Linguistics',                   status: 'Revoked' },
  { id: 's6', name: 'Dr. Researcher F', institution: 'Stanford Univ.',    specialization: 'Hospitality Management Strategies',           status: 'Active'  },
];

const STATUS_STYLE = {
  Active:  { bg: '#D1FAE5', color: '#065F46' },
  Pending: { bg: '#FEF3C7', color: '#92400E' },
  Revoked: { bg: '#FEE2E2', color: '#991B1B' },
};

const BLANK = { name: '', institution: '', specialization: '', tags: '', imageUrl: '', status: 'Pending' };

export default function ScientistManager() {
  const [scientists, setScientists] = useState(INIT_SCIENTISTS);
  const [editId, setEditId]         = useState(null);
  const [editData, setEditData]     = useState({});
  const [showModal, setShowModal]   = useState(false);
  const [newData, setNewData]       = useState(BLANK);
  const [toast, setToast]           = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2800); };

  const setStatus = (id, status) => {
    setScientists(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    showToast(`${status === 'Active' ? 'Reinstated' : 'Revoked'} successfully.`);
  };

  const startEdit = (s) => { setEditId(s.id); setEditData({ name: s.name, institution: s.institution, specialization: s.specialization }); };
  const saveEdit  = (id) => {
    setScientists(prev => prev.map(s => s.id === id ? { ...s, ...editData } : s));
    setEditId(null); showToast('Profile updated.');
  };

  const addScientist = () => {
    if (!newData.name.trim()) return;
    const id = 's' + Date.now();
    setScientists(prev => [...prev, { ...newData, id }]);
    setNewData(BLANK); setShowModal(false); showToast('Scientist added.');
  };

  const stats = {
    total:   scientists.length,
    active:  scientists.filter(s => s.status === 'Active').length,
    pending: scientists.filter(s => s.status === 'Pending').length,
    revoked: scientists.filter(s => s.status === 'Revoked').length,
  };

  const inp = (val, onChange) => (
    <input value={val} onChange={e => onChange(e.target.value)}
      style={{ padding: '7px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' }} />
  );

  return (
    <div style={{ position: 'relative' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 24, background: '#0B1F3A', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 9999, boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'Total Scientists', value: stats.total,   color: '#1A56DB' },
          { label: 'Active',           value: stats.active,  color: '#059669' },
          { label: 'Pending',          value: stats.pending, color: '#D97706' },
          { label: 'Revoked',          value: stats.revoked, color: '#EF4444' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: '1px solid #E8EDF5' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', margin: '0 0 6px' }}>{label}</p>
            <p style={{ fontSize: 26, fontWeight: 800, color, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EDF5', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #E8EDF5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0B1F3A', margin: 0 }}>Scientist & Mentor Management</h3>
            <p style={{ fontSize: 12, color: '#94A3B8', margin: '3px 0 0' }}>Approve, revoke, or update scientist profiles visible to students.</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            <Plus size={15} /> Add Scientist
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead style={{ background: '#F8FAFF' }}>
              <tr>
                {['Avatar', 'Name', 'Institution', 'Specialization', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scientists.map(s => {
                const sc = STATUS_STYLE[s.status] || STATUS_STYLE.Active;
                const isEditing = editId === s.id;
                return (
                  <tr key={s.id} style={{ borderTop: '1px solid #F1F5F9', background: isEditing ? '#F8FAFF' : '#fff' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#1D4ED8' }}>
                        {s.name.charAt(s.name.lastIndexOf(' ') + 1)}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {isEditing ? inp(editData.name, v => setEditData(p => ({ ...p, name: v })))
                        : <span style={{ fontSize: 13, fontWeight: 600, color: '#0B1F3A' }}>{s.name}</span>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {isEditing ? inp(editData.institution, v => setEditData(p => ({ ...p, institution: v })))
                        : <span style={{ fontSize: 13, color: '#64748B' }}>{s.institution}</span>}
                    </td>
                    <td style={{ padding: '12px 16px', maxWidth: 220 }}>
                      {isEditing ? inp(editData.specialization, v => setEditData(p => ({ ...p, specialization: v })))
                        : <span style={{ fontSize: 12, color: '#64748B' }}>{s.specialization}</span>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{s.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                        {isEditing ? (
                          <>
                            <button onClick={() => saveEdit(s.id)} style={{ padding: '5px 12px', background: '#059669', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Save</button>
                            <button onClick={() => setEditId(null)} style={{ padding: '5px 12px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                          </>
                        ) : (
                          <>
                            {s.status !== 'Revoked'
                              ? <button onClick={() => setStatus(s.id, 'Revoked')} style={{ padding: '5px 10px', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Revoke</button>
                              : <button onClick={() => setStatus(s.id, 'Active')} style={{ padding: '5px 10px', background: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Reinstate</button>
                            }
                            <button onClick={() => startEdit(s)} style={{ padding: '5px 10px', background: '#DBEAFE', color: '#1D4ED8', border: '1px solid #93C5FD', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                            <a href="/scientists" target="_blank" rel="noreferrer" style={{ padding: '5px 10px', background: '#F8FAFF', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: 7, fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>View</a>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: 480, maxWidth: '95vw', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0B1F3A' }}>Add Scientist</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Name',           key: 'name'            },
                { label: 'Institution',    key: 'institution'     },
                { label: 'Specialization', key: 'specialization'  },
                { label: 'Tags (comma separated)', key: 'tags'    },
                { label: 'Image URL',      key: 'imageUrl'        },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>{label}</label>
                  {inp(newData[key], v => setNewData(p => ({ ...p, [key]: v })))}
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>Status</label>
                <select value={newData.status} onChange={e => setNewData(p => ({ ...p, status: e.target.value }))}
                  style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, width: '100%', outline: 'none' }}>
                  <option>Active</option><option>Pending</option><option>Revoked</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={addScientist} style={{ flex: 1, padding: '11px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                <Check size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />Add Scientist
              </button>
              <button onClick={() => setShowModal(false)} style={{ padding: '11px 20px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
