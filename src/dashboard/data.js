// ─── Student mock data ────────────────────────────────────────────────────────

export const STUDENT = {
  plan: 'Analyst',
  planPrice: 999,
  enrolledDate: '2026-04-05',
  daysActive: 12,
  mentorAssigned: false,
};

// ─── Plans ────────────────────────────────────────────────────────────────────

export const ALL_PLANS = [
  {
    id: 'explorer',   name: 'Explorer',   price: 99,
    features: ['Problem statement document','Literature review links','Field observations PDF','PDF download'],
  },
  {
    id: 'analyst',    name: 'Analyst',    price: 999,
    features: ['Everything in Explorer','Research methodologies','Resource checklist','Hypothesis framework','Email support'],
  },
  {
    id: 'researcher', name: 'Researcher', price: 2999,
    features: ['Everything in Analyst','2 hrs 1-on-1 mentorship','Data collection guidance','Research design review','Priority support'],
  },
  {
    id: 'scholar',    name: 'Scholar',    price: 4999,
    features: ['Everything in Researcher','Paper drafting assistance','Peer-review simulation','Journal submission support','Certificate of Completion'],
  },
  {
    id: 'innovator',  name: 'Innovator',  price: 29999,
    features: ['Everything in Scholar','IPR legal consultation','Full patent drafting','Filing fee support','Commercialization roadmap','Dedicated PM'],
  },
];

// ─── Research Pipeline ────────────────────────────────────────────────────────

export const PIPELINE_STAGES = [
  { id: 1, name: 'Problem Selection',  status: 'done',     icon: '✅' },
  { id: 2, name: 'Literature Review',  status: 'active',   icon: '🔄' },
  { id: 3, name: 'Methodology',        status: 'locked',   icon: '🔒' },
  { id: 4, name: 'Draft Writing',      status: 'locked',   icon: '🔒' },
  { id: 5, name: 'Peer Review',        status: 'locked',   icon: '🔒' },
  { id: 6, name: 'Publication Ready',  status: 'locked',   icon: '🔒' },
];

export const ACTIVE_STAGE_TASKS = [
  { id: 1, label: 'Read 5 foundational papers',      done: true  },
  { id: 2, label: 'Create reference list',           done: true  },
  { id: 3, label: 'Write summary notes',             done: false },
  { id: 4, label: 'Submit to mentor for review',     done: false },
];

// ─── Saved Problems (Kanban) ──────────────────────────────────────────────────

export const SAVED_PROBLEMS = [
  { id: 1, title: 'Urban Air Quality Measurement',         category: 'Environment', col: 'interested', color: '#16A34A' },
  { id: 2, title: 'Bias in Facial Recognition',           category: 'Technology',  col: 'interested', color: '#7C3AED' },
  { id: 3, title: 'Antibiotic Resistance Patterns',       category: 'Health',      col: 'exploring',  color: '#DC2626' },
  { id: 4, title: 'Solar Panel Efficiency in Tropics',    category: 'Energy',      col: 'researching',color: '#D97706' },
];

// ─── Activity Feed ────────────────────────────────────────────────────────────

export const ACTIVITY = [
  { id: 1, text: 'Saved problem: Urban Air Quality Index',  time: '2 hours ago',  color: '#2563EB' },
  { id: 2, text: 'Viewed problem: ML in Healthcare',        time: 'Yesterday',    color: '#7C3AED' },
  { id: 3, text: 'Completed: Read 5 foundational papers',   time: '3 days ago',   color: '#16A34A' },
  { id: 4, text: 'Started Literature Review stage',         time: '5 days ago',   color: '#D97706' },
  { id: 5, text: 'Joined GRIFA',                            time: '2026-04-01',   color: '#0B1F3A' },
];

// ─── Journal entries ──────────────────────────────────────────────────────────

export const JOURNAL_ENTRIES_INIT = [
  { id: 1, date: '2026-04-28', text: 'Started reading about air quality sensors. Found an interesting paper by Dr. Mehta on PM2.5 measurement in urban environments. The methodology looks applicable...' },
  { id: 2, date: '2026-04-25', text: 'Mentor session went well. Need to narrow my research question to focus specifically on low-cost sensor networks rather than all monitoring approaches.' },
  { id: 3, date: '2026-04-20', text: 'First day on GRIFA. Exploring the problems section — so many interesting topics. Leaning towards environment or health as my research domain.' },
];

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export const LEADERBOARD = [
  { rank: 1,  name: 'Aanya Sharma',   plan: 'Innovator', points: 980, badge: '🥇' },
  { rank: 2,  name: 'Rohan Mehta',    plan: 'Scholar',   points: 870, badge: '🥈' },
  { rank: 3,  name: 'Priya Nair',     plan: 'Scholar',   points: 810, badge: '🥉' },
  { rank: 4,  name: 'Dev Kapoor',     plan: 'Researcher', points: 740, badge: null },
  { rank: 5,  name: 'You',            plan: 'Analyst',   points: 390, badge: null, isMe: true },
  { rank: 6,  name: 'Sana Khan',      plan: 'Analyst',   points: 350, badge: null },
  { rank: 7,  name: 'Arjun Verma',    plan: 'Explorer',  points: 210, badge: null },
  { rank: 8,  name: 'Tanya Singh',    plan: 'Explorer',  points: 180, badge: null },
];

// ─── Certificate (mock — null means not yet earned) ───────────────────────────

export const CERTIFICATE = null; // set to object below to simulate earned state
// export const CERTIFICATE = {
//   title: 'Research Foundation Certificate',
//   tier: 'Explorer Tier',
//   issued: '2026-04-10',
// };

// ─── Mentor ───────────────────────────────────────────────────────────────────

export const MENTOR = null; // set to object below to simulate assigned state
// export const MENTOR = {
//   name: 'Dr. Priya Nair',
//   initials: 'PN',
//   institution: 'IISc Bangalore',
//   domain: 'Environmental Science',
//   nextSession: '2026-05-05 at 4:00 PM',
// };
