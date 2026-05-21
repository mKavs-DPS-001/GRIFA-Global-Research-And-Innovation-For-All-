# GRIFA — Global Research & Innovation For All

A full-stack research platform connecting real-world problems with students, researchers, and scientists globally.

---

## 🏗️ Architecture

```
GRIFA/
├── src/                  # Frontend — React 19 + Vite + TailwindCSS v4
│   ├── admin/            # Admin dashboard (Firestore-controlled access)
│   ├── components/       # Shared UI components
│   ├── context/          # Auth context (Firebase Auth)
│   ├── firebase/         # Firebase client config
│   ├── pages/            # Route-level page components
│   └── data/             # Static problem datasets
└── backend/              # Backend — Node.js + Express API
    └── src/
        ├── config/       # Firebase Admin + MongoDB connections
        ├── middleware/    # Auth, rate limiting
        ├── models/       # Mongoose schemas
        ├── routes/       # Express route handlers
        └── services/     # Business logic
```

**External services used:**
| Service | Purpose |
|---|---|
| Firebase Auth | User authentication |
| Firestore | Admin roles, enrollments, inbox |
| MongoDB Atlas | Problem data, scientists, projects |
| Razorpay | Payments (plans & donations) |
| EmailJS | Contact form emails (frontend) |

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js** ≥ 18 — [nodejs.org](https://nodejs.org)
- **Git** — [git-scm.com](https://git-scm.com)
- A Firebase project (ask the team lead for access)
- A MongoDB Atlas connection string (ask the team lead)

---

### 1. Clone the repo

```bash
git clone https://github.com/YOUR-ORG/GRIFA-Global-Research-And-Innovation-For-All-.git
cd GRIFA-Global-Research-And-Innovation-For-All-
```

---

### 2. Frontend setup

```bash
# Install dependencies
npm install

# Create your local env file from the template
cp .env.local.example .env.local
```

Edit `.env.local` and fill in the real values (get them from the team lead):

```env
VITE_FIREBASE_API_KEY=          # Firebase Console → Project Settings → Web App
VITE_FIREBASE_AUTH_DOMAIN=grifadpsp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=grifadpsp
VITE_FIREBASE_STORAGE_BUCKET=grifadpsp.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=872942910319
VITE_FIREBASE_APP_ID=1:872942910319:web:1cb7314b49704bb401869a
VITE_RAZORPAY_KEY_ID=           # Razorpay Dashboard → API Keys (test key for dev)
VITE_API_BASE_URL=http://localhost:3000
```

```bash
# Start the dev server
npm run dev
# → Frontend runs at http://localhost:5173
```

---

### 3. Backend setup

```bash
cd backend

# Install dependencies
npm install

# Create your local env file from the template
cp .env.example .env
```

Edit `backend/.env` and fill in the real values:

```env
MONGODB_URI=           # MongoDB Atlas → Connect → Drivers → connection string
REDIS_URL=             # Redis Cloud URL (or leave blank if not using caching)
FIREBASE_PROJECT_ID=grifadpsp
FIREBASE_CLIENT_EMAIL= # Firebase Console → Project Settings → Service Accounts → Generate new private key
FIREBASE_PRIVATE_KEY=  # From the downloaded service account JSON (the full -----BEGIN PRIVATE KEY----- block)
RAZORPAY_KEY_ID=       # Razorpay Dashboard → API Keys
RAZORPAY_KEY_SECRET=   # Razorpay Dashboard → API Keys
ALLOWED_ORIGIN=http://localhost:5173
PORT=3000
NODE_ENV=development
```

> **How to get Firebase service account credentials:**
> 1. Go to [Firebase Console](https://console.firebase.google.com) → your project
> 2. Click the ⚙️ gear → **Project Settings** → **Service Accounts**
> 3. Click **Generate new private key** → download the JSON
> 4. Copy `client_email` → `FIREBASE_CLIENT_EMAIL`
> 5. Copy `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and `\n` characters)
> 6. **Delete the downloaded JSON file** — never commit it.

```bash
# Start the backend dev server (auto-restarts on changes)
npm run dev
# → API runs at http://localhost:3000
```

---

### 4. Run both together

Open two terminal windows — one for `npm run dev` in the root, one for `npm run dev` in `backend/`. Both must be running for full functionality.

---

## 🧱 Available Scripts

### Frontend (root)
| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### Backend (`backend/`)
| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-restart) |
| `npm start` | Start without nodemon (production) |

---

## 🌐 Deployment

### Frontend — Vercel (recommended)

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import the repo
3. Set **Root Directory** to `/` (leave default)
4. Set **Framework Preset** to **Vite**
5. Add all `VITE_*` environment variables from `.env.local.example` under **Environment Variables**
6. Click **Deploy**

Every push to `main` auto-deploys.

---

### Backend — Render (recommended)

#### Option A — Using render.yaml (fastest)
A `render.yaml` blueprint is already included at the repo root.

1. Push the repo to GitHub
2. Go to [render.com](https://render.com) → **New** → **Blueprint**
3. Connect your GitHub repo — Render will auto-detect `render.yaml`
4. Click **Apply** — it creates a Web Service for the backend automatically
5. Go to the new service → **Environment** tab → add all the secret variables:

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | MongoDB Atlas → Connect → Drivers |
| `FIREBASE_PROJECT_ID` | `grifadpsp` |
| `FIREBASE_CLIENT_EMAIL` | Firebase Console → Service Accounts → Generate key |
| `FIREBASE_PRIVATE_KEY` | Same JSON — the full `-----BEGIN PRIVATE KEY-----` block |
| `RAZORPAY_KEY_ID` | Razorpay Dashboard → API Keys |
| `RAZORPAY_KEY_SECRET` | Razorpay Dashboard → API Keys |
| `ALLOWED_ORIGIN` | Your Vercel frontend URL (e.g. `https://grifa.vercel.app`) |
| `REDIS_URL` | Optional — leave blank if not using Redis |

> ⚠️ **Do NOT set `PORT`** — Render injects it automatically. Overriding it will break deploys.

6. Click **Save Changes** → your backend deploys automatically
7. Copy the Render service URL (e.g. `https://grifa-backend.onrender.com`)
8. Set `VITE_API_BASE_URL=https://grifa-backend.onrender.com` in your Vercel environment variables

Every push to `main` triggers a new deploy on Render automatically.

#### Option B — Manual dashboard setup
1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** → `backend`
4. Set **Build Command** → `npm install`
5. Set **Start Command** → `npm start`
6. Set **Environment** → `Node`
7. Add all environment variables from the table above
8. Click **Create Web Service**

### Backend — Manual VPS (alternative)

```bash
# On your server
git clone <repo>
cd GRIFA.../backend
npm install
cp .env.example .env   # fill in prod values
npm start

# Use PM2 to keep it alive
npm install -g pm2
pm2 start src/index.js --name grifa-backend
pm2 save
```

---

## 👥 Team Collaboration

### What to share with teammates

Share these **privately** (never in the repo):
- Firebase API key (rotated — get from Firebase Console)
- MongoDB Atlas connection string
- Razorpay API keys
- Firebase service account credentials

Recommended: share via a **private team password manager** (e.g. Bitwarden, 1Password) or a private Notion page.

### Git workflow

```bash
# Always create a feature branch — never commit directly to main
git checkout -b feature/your-feature-name

# Make changes, then commit
git add .
git commit -m "feat: describe your change"

# Push and open a Pull Request on GitHub
git push origin feature/your-feature-name
```

### What's safe to commit ✅
- All source code under `src/` and `backend/src/`
- `.env.example` and `.env.local.example` (templates with no real values)
- `package.json`, `vite.config.js`, etc.

### What must NEVER be committed ❌
- `.env`, `.env.local`, or any `.env.*` file with real values
- Firebase service account JSON files
- Any `*.pem`, `*.key`, `*.crt` files
- Razorpay secret keys

---

## 🔐 Admin Access

Admin dashboard is at `/admin`. Access is controlled via Firestore — only users whose UID is listed in the `admins` Firestore collection can log in. Ask the team lead to add your Firebase UID.

---

## 📬 Contact

Built by **mKavs Global Tech** for GRIFA / DPSP.
