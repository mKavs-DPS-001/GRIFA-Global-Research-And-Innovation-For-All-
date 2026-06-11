import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import plansRoutes from './routes/plans.js';
import enrollmentsRoutes from './routes/enrollments.js';
import donationsRoutes from './routes/donations.js';
import scientistsRoutes from './routes/scientists.js';
import problemsRoutes from './routes/problems.js';
import contactRoutes from './routes/contact.js';
import settingsRoutes from './routes/settings.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'https://grifa.bydps.com',
  credentials: true,
}));
app.use(express.json());

// Health Check
app.get('/health', async (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'ok', db: dbState, ts: new Date().toISOString() });
});

// API Routes (to be mounted)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/plans', plansRoutes);
app.use('/api/v1/enrollments', enrollmentsRoutes);
app.use('/api/v1/donations', donationsRoutes);
app.use('/api/v1/scientists', scientistsRoutes);
app.use('/api/v1/problems', problemsRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/settings', settingsRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
