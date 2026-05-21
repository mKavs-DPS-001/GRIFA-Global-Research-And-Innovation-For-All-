import express from 'express';
import Plan from '../models/Plan.js';
import { verifyFirebaseToken, attachUserFromDB, checkRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/v1/plans (Public)
router.get('/', async (req, res, next) => {
  try {
    const plans = await Plan.find({ is_active: true }).sort({ price_inr: 1 });
    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/plans (Admin only)
router.post('/', verifyFirebaseToken, attachUserFromDB, checkRole('admin'), async (req, res, next) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
});

export default router;
