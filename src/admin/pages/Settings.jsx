import React, { useState } from 'react';
import { Save, ToggleLeft, ToggleRight, Database, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

/* ── Reusable sub-components ─────────────────────────────────────────────── */

function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E8EDF5', marginBottom: 20 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0B1F3A', margin: '0 0 20px', paddingBottom: 14, borderBottom: '1px solid #F1F5F9' }}>{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 5 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{ padding: '9px 14px', border: '1px solid #E2E8F0', borderRadius: 9, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box', color: '#0B1F3A' }} />
    </div>
  );
}

function Toggle({ label, desc, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#0B1F3A', margin: 0 }}>{label}</p>
        {desc && <p style={{ fontSize: 12, color: '#94A3B8', margin: '3px 0 0' }}>{desc}</p>}
      </div>
      <button onClick={() => onChange(!value)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        {value
          ? <ToggleRight size={36} color="#1A56DB" />
          : <ToggleLeft  size={36} color="#CBD5E1" />
        }
      </button>
    </div>
  );
}

/* ── Maintenance Modal ───────────────────────────────────────────────────── */

function MaintenanceModal({ schedule, setSchedule, onClose, onConfirm }) {
  const today = new Date().toISOString().split('T')[0];

  /* Compute live duration */
  let durationEl = null;
  if (schedule.startDate && schedule.startTime && schedule.endDate && schedule.endTime) {
    const start = new Date(`${schedule.startDate}T${schedule.startTime}`);
    const end   = new Date(`${schedule.endDate}T${schedule.endTime}`);
    const diffMs = end - start;
    if (diffMs <= 0) {
      durationEl = (
        <div style={{ marginTop: 14, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, color: '#B91C1C', fontWeight: 600 }}>
          ⚠️ End time must be after start time
        </div>
      );
    } else {
      const totalMins = Math.floor(diffMs / 60000);
      const h = Math.floor(totalMins / 60);
      const m = totalMins % 60;
      durationEl = (
        <div style={{ marginTop: 14, padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, fontSize: 13, color: '#15803D', fontWeight: 600 }}>
          ✓ Duration: {h}h {m}m
        </div>
      );
    }
  }

  const set = (key) => (e) => setSchedule(s => ({ ...s, [key]: e.target.value }));

  const inputStyle = {
    padding: '9px 14px', border: '1px solid #E2E8F0', borderRadius: 9,
    fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box',
    color: '#0B1F3A', background: '#F8FAFC',
  };
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 5 };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 500, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0B1F3A', margin: 0 }}>🔧 Schedule Maintenance</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#64748B', lineHeight: 1 }}>✕</button>
        </div>

        {/* Warning banner */}
        <div style={{ padding: '10px 14px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 10, fontSize: 13, color: '#92400E', fontWeight: 600, marginBottom: 22 }}>
          ⚠️ During this window, all users (except admin) will see the maintenance page.
        </div>

        {/* Date/Time grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px', marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Start Date</label>
            <input type="date" min={today} value={schedule.startDate} onChange={set('startDate')} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Start Time</label>
            <input type="time" value={schedule.startTime} onChange={set('startTime')} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>End Date</label>
            <input type="date" min={schedule.startDate || today} value={schedule.endDate} onChange={set('endDate')} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>End Time</label>
            <input type="time" value={schedule.endTime} onChange={set('endTime')} style={inputStyle} />
          </div>
        </div>

        {/* Reason */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Reason</label>
          <input type="text" value={schedule.reason} onChange={set('reason')} placeholder="e.g. Database migration, Server upgrade..."
            style={inputStyle} />
        </div>

        {/* Message */}
        <div style={{ marginBottom: 4 }}>
          <label style={labelStyle}>Message shown to users</label>
          <textarea rows={2} value={schedule.message} onChange={set('message')}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
        </div>

        {/* Duration preview */}
        {durationEl}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <button onClick={onClose}
            style={{ padding: '10px 20px', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            style={{ padding: '10px 22px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            🔧 Confirm Maintenance Window
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Seed data for prototype ─────────────────────────────────────────────────

const SEED_CONVERSATIONS = [
  {
    name: 'Arjun Mehta', email: 'arjun.mehta@gmail.com',
    subject: 'Newtonian Fluid Speed Breakers',
    tag: 'Problem Report', status: 'Open', unread: true,
    messages: [
      { from: 'user', text: 'I saw this problem listed on your site and I believe I have a workable solution involving shear-thickening fluids. Can I get access to the full brief?', time: new Date(Date.now() - 3600000).toISOString() },
    ],
  },
  {
    name: 'Priya Sharma', email: 'priya.s@iitm.ac.in',
    subject: 'Researcher Tier Upgrade Query',
    tag: 'Support', status: 'In Progress', unread: true,
    messages: [
      { from: 'user', text: 'I enrolled in the Analyst plan last week but my dashboard still shows Explorer. Can you fix this?', time: new Date(Date.now() - 7200000).toISOString() },
      { from: 'admin', text: 'Hi Priya, we are looking into this. Your payment was received. We will upgrade your account within 24 hours.', time: new Date(Date.now() - 5000000).toISOString() },
    ],
  },
  {
    name: 'Dr. Ravi Kumar', email: 'ravi.k@iisc.ac.in',
    subject: 'Collaboration with GRIFA scientists',
    tag: 'General', status: 'Open', unread: false,
    messages: [
      { from: 'user', text: 'I am a professor at IISc and I would like to collaborate with your platform as a listed scientist mentor. How do I apply?', time: new Date(Date.now() - 86400000).toISOString() },
    ],
  },
  {
    name: 'Sneha Iyer', email: 'sneha.iyer@yahoo.com',
    subject: 'Open Urination Problem — field data',
    tag: 'Problem Report', status: 'Open', unread: true,
    messages: [
      { from: 'user', text: 'I have collected survey data from 3 wards in Bengaluru on open urination incidents. Would this be useful for the GRIFA problem listing?', time: new Date(Date.now() - 172800000).toISOString() },
    ],
  },
  {
    name: 'Mohammed Farouk', email: 'm.farouk@gmail.com',
    subject: 'Payment receipt not received',
    tag: 'Support', status: 'Resolved', unread: false,
    messages: [
      { from: 'user', text: 'I paid for the Researcher plan but did not receive any email confirmation or receipt. Transaction ID: TXN8827263.', time: new Date(Date.now() - 259200000).toISOString() },
      { from: 'admin', text: 'Hi Mohammed, we have resent your receipt to your registered email. Please check spam. Your account is active.', time: new Date(Date.now() - 250000000).toISOString() },
    ],
  },
  {
    name: 'Ananya Krishnan', email: 'ananya.k@nit.edu',
    subject: 'Gallery submission for Zoology project',
    tag: 'General', status: 'Open', unread: false,
    messages: [
      { from: 'user', text: 'Our team completed a 6-month study on stray dog population management in Mysuru. We have a 12-minute documentary. Can we submit it to the GRIFA gallery?', time: new Date(Date.now() - 345600000).toISOString() },
    ],
  },
];

/* ── Settings Page ───────────────────────────────────────────────────────── */

export default function Settings() {
  const { setMaintenanceActive } = useAuth();

  const [platform, setPlatform] = useState({ name: 'GRIFA', sub: 'by DPSP', email: 'info@grifa.in', whatsapp: '+91 XXXXX XXXXX' });
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [toast, setToast] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);

  /* Maintenance state */
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState({
    startDate: '', startTime: '', endDate: '', endTime: '',
    message: "GRIFA is currently under scheduled maintenance. We'll be back shortly.",
    reason: '',
  });
  const [maintenanceActive, setLocalMaintenanceActive] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const seedInbox = async () => {
    setSeeding(true);
    try {
      for (const convo of SEED_CONVERSATIONS) {
        await addDoc(collection(db, 'inbox'), {
          ...convo,
          createdAt: serverTimestamp(),
        });
      }
      setSeedDone(true);
      showToast('6 test conversations seeded to Firestore inbox.');
    } catch (err) {
      console.error('Seed error:', err);
      showToast('Seed failed: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const savePlatform = () => showToast('Platform info saved.');
  const savePassword = () => {
    if (!passwords.current || !passwords.newPw) return showToast('Fill in all password fields.');
    if (passwords.newPw !== passwords.confirm) return showToast('Passwords do not match.');
    setPasswords({ current: '', newPw: '', confirm: '' });
    showToast('Password updated successfully.');
  };

  /* Confirm maintenance modal submission */
  const handleConfirmMaintenance = () => {
    const { startDate, startTime, endDate, endTime } = maintenanceSchedule;
    if (!startDate || !startTime || !endDate || !endTime) {
      alert('Please fill in all four date/time fields.');
      return;
    }
    const start = new Date(`${startDate}T${startTime}`);
    const end   = new Date(`${endDate}T${endTime}`);
    if (end <= start) {
      alert('End time must be after start time.');
      return;
    }
    const active = { ...maintenanceSchedule };
    setLocalMaintenanceActive(active);
    setMaintenanceActive(active);           // push to AuthContext → App.jsx
    setShowMaintenanceModal(false);
    showToast('Maintenance window scheduled.');
  };

  /* Cancel maintenance */
  const handleCancelMaintenance = () => {
    setLocalMaintenanceActive(null);
    setMaintenanceActive(null);
    showToast('Maintenance window cancelled.');
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 24, background: '#0B1F3A', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 9999 }}>
          {toast}
        </div>
      )}

      {/* Maintenance Modal */}
      {showMaintenanceModal && (
        <MaintenanceModal
          schedule={maintenanceSchedule}
          setSchedule={setMaintenanceSchedule}
          onClose={() => setShowMaintenanceModal(false)}
          onConfirm={handleConfirmMaintenance}
        />
      )}

      {/* Platform Info */}
      <Section title="Platform Info">
        <Field label="Platform Name"    value={platform.name}     onChange={v => setPlatform(p => ({ ...p, name: v }))} />
        <Field label="Sub-brand"        value={platform.sub}      onChange={v => setPlatform(p => ({ ...p, sub: v }))} />
        <Field label="Contact Email"    value={platform.email}    onChange={v => setPlatform(p => ({ ...p, email: v }))} type="email" />
        <Field label="WhatsApp Number"  value={platform.whatsapp} onChange={v => setPlatform(p => ({ ...p, whatsapp: v }))} />
        <button onClick={savePlatform} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          <Save size={14} /> Save Changes
        </button>
      </Section>

      {/* Admin Access */}
      <Section title="Admin Access">
        <Field label="Current Password" value={passwords.current} onChange={v => setPasswords(p => ({ ...p, current: v }))} type="password" />
        <Field label="New Password"     value={passwords.newPw}   onChange={v => setPasswords(p => ({ ...p, newPw: v }))}   type="password" />
        <Field label="Confirm Password" value={passwords.confirm} onChange={v => setPasswords(p => ({ ...p, confirm: v }))} type="password" />
        <button onClick={savePassword} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 20px', background: '#1A56DB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          <Save size={14} /> Update Password
        </button>
      </Section>

      {/* Pricing Controls */}
      <Section title="Pricing Controls">
        <Toggle
          label="Show upgrade pricing to logged-in users"
          desc="When enabled, students who have purchased a plan will see upgrade costs instead of full prices."
          value={showUpgrade}
          onChange={setShowUpgrade}
        />
      </Section>

      {/* Maintenance Mode */}
      <Section title="Maintenance Mode">
        {maintenanceActive === null ? (
          /* OFF state — toggle that opens modal */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0B1F3A', margin: 0 }}>Put site in maintenance mode</p>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: '3px 0 0' }}>Schedule a window when users will see the maintenance page.</p>
            </div>
            <button onClick={() => setShowMaintenanceModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <ToggleLeft size={36} color="#CBD5E1" />
            </button>
          </div>
        ) : (
          /* ACTIVE state — red info card */
          <div style={{ padding: '18px 20px', background: '#FFF1F2', border: '1.5px solid #FECDD3', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#DC2626', letterSpacing: 0.5, background: '#FEE2E2', padding: '4px 10px', borderRadius: 20 }}>
                ● MAINTENANCE SCHEDULED
              </span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#0B1F3A', margin: '0 0 4px' }}>
              {maintenanceActive.startDate} {maintenanceActive.startTime} → {maintenanceActive.endDate} {maintenanceActive.endTime}
            </p>
            {maintenanceActive.reason && (
              <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0' }}>
                <strong>Reason:</strong> {maintenanceActive.reason}
              </p>
            )}
            <p style={{ fontSize: 13, color: '#64748B', margin: '8px 0 16px', fontStyle: 'italic' }}>
              "{maintenanceActive.message}"
            </p>
            <button onClick={handleCancelMaintenance}
              style={{ padding: '9px 20px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Cancel Maintenance
            </button>
          </div>
        )}
      </Section>

      {/* Prototype Data */}
      <Section title="Prototype Data">
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 16px', lineHeight: 1.6 }}>
          Seed the Firestore <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: 4 }}>inbox</code> collection with 6 realistic test conversations so the Admin Inbox is not empty on first load. Only run once — running again adds duplicates.
        </p>
        <button
          onClick={seedInbox}
          disabled={seeding || seedDone}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: seedDone ? '#10B981' : seeding ? '#94A3B8' : '#0B1F3A', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: seeding || seedDone ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
        >
          {seedDone
            ? <><CheckCircle size={15} /> Seeded Successfully</>
            : seeding
            ? <><Database size={15} /> Seeding…</>
            : <><Database size={15} /> Seed Inbox Test Data</>}
        </button>
      </Section>
    </div>
  );
}
