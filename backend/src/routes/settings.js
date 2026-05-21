import express from 'express';
import MaintenanceWindow from '../models/MaintenanceWindow.js';
import { verifyFirebaseToken, attachUserFromDB, checkRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/settings/maintenance
router.get('/maintenance', async (req, res, next) => {
  try {
    const window = await MaintenanceWindow.findOne().sort({ createdAt: -1 });
    if (!window) {
      return res.json({ success: true, data: { active: false } });
    }
    const now = new Date();
    const isActive = window.startTime <= now && window.endTime >= now;
    res.json({ success: true, data: { active: isActive, message: window.message, estimatedCompletion: window.endTime } });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/settings/maintenance (Admin only)
router.post('/maintenance', verifyFirebaseToken, attachUserFromDB, checkRole('admin'), async (req, res, next) => {
  try {
    const { startTime, endTime, message } = req.body;
    const window = await MaintenanceWindow.create({ startTime, endTime, message });
    res.status(201).json({ success: true, data: window });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/settings/maintenance (Admin only)
router.delete('/maintenance', verifyFirebaseToken, attachUserFromDB, checkRole('admin'), async (req, res, next) => {
  try {
    await MaintenanceWindow.deleteMany({});
    res.json({ success: true, data: { active: false } });
  } catch (error) {
    next(error);
  }
});

export default router;
