import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Plan from '../models/Plan.js';
import { verifyFirebaseToken, attachUserFromDB, checkRole } from '../middleware/auth.js';
import { createOrder, verifySignature } from '../services/razorpay.js';

const router = express.Router();

// GET /api/v1/enrollments/mine (Authenticated)
router.get('/mine', verifyFirebaseToken, attachUserFromDB, async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({
      user_id: req.dbUser._id,
      status: 'active',
    }).populate('plan_id').sort({ enrolled_at: -1 });

    res.json({ success: true, data: enrollments });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/enrollments (Admin only)
router.get('/', verifyFirebaseToken, attachUserFromDB, checkRole('admin'), async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('user_id', 'email display_name')
      .populate('plan_id', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: enrollments });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/enrollments/initiate (Authenticated)
router.post('/initiate', verifyFirebaseToken, attachUserFromDB, async (req, res, next) => {
  try {
    const { plan_id } = req.body;
    const plan = await Plan.findById(plan_id);
    
    if (!plan || !plan.is_active) {
      return res.status(404).json({ success: false, error: { code: 'PLAN_NOT_FOUND' } });
    }

    // Check idempotency (already active in this plan?)
    const existing = await Enrollment.findOne({
      user_id: req.dbUser._id,
      plan_id: plan._id,
      status: 'active',
    });
    if (existing) {
      return res.status(409).json({ success: false, error: { code: 'ALREADY_ENROLLED' } });
    }

    const receipt = `grifa_${req.dbUser._id}_${Date.now()}`;
    const rzpOrder = await createOrder({ amount_inr: plan.price_inr, receipt });

    const enrollment = await Enrollment.create({
      user_id: req.dbUser._id,
      plan_id: plan._id,
      razorpay_order_id: rzpOrder.id,
      amount_paid_inr: plan.price_inr,
      status: 'pending',
    });

    res.json({
      success: true,
      data: {
        order_id: rzpOrder.id,
        amount: rzpOrder.amount, // in paise
        currency: 'INR',
        enrollment_id: enrollment._id,
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/enrollments/verify (Authenticated)
router.post('/verify', verifyFirebaseToken, attachUserFromDB, async (req, res, next) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_FIELDS' } });
    }

    const enrollment = await Enrollment.findOne({
      razorpay_order_id,
      user_id: req.dbUser._id,
      status: 'pending',
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, error: { code: 'ENROLLMENT_NOT_FOUND' } });
    }

    const valid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!valid) {
      console.warn(`[PAYMENT] Signature mismatch for order ${razorpay_order_id}, user ${req.dbUser._id}`);
      return res.status(400).json({ success: false, error: { code: 'PAYMENT_VERIFICATION_FAILED' } });
    }

    // Check duplicate (idempotency)
    const duplicate = await Enrollment.findOne({ razorpay_payment_id });
    if (duplicate) {
      return res.status(200).json({ success: true, data: { enrollment_id: duplicate._id } });
    }

    enrollment.razorpay_payment_id = razorpay_payment_id;
    enrollment.status = 'active';
    enrollment.enrolled_at = new Date();
    await enrollment.save();

    console.info(`[PAYMENT] Enrollment ${enrollment._id} activated for user ${req.dbUser.email}`);
    res.json({ success: true, data: { enrollment_id: enrollment._id } });

  } catch (error) {
    next(error);
  }
});

export default router;
