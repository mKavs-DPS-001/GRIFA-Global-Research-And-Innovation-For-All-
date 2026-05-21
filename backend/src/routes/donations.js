import express from 'express';
import Donation from '../models/Donation.js';
import { createOrder, verifySignature } from '../services/razorpay.js';
import { verifyFirebaseToken, attachUserFromDB, checkRole } from '../middleware/auth.js';

const router = express.Router();

// POST /api/v1/donations/initiate (Public)
router.post('/initiate', async (req, res, next) => {
  try {
    const { amount_inr, donor_name, donor_email, pan_number, user_id } = req.body;
    
    if (!amount_inr || amount_inr < 100) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_AMOUNT', message: 'Minimum donation is 100 INR' } });
    }

    const receipt = `grifa_don_${Date.now()}`;
    const rzpOrder = await createOrder({ amount_inr, receipt, notes: { type: 'donation' } });

    const donation = await Donation.create({
      user_id: user_id || null,
      amount_inr,
      donor_name,
      donor_email,
      pan_number,
      razorpay_order_id: rzpOrder.id,
      status: 'pending',
    });

    res.json({
      success: true,
      data: {
        order_id: rzpOrder.id,
        amount: rzpOrder.amount, // in paise
        currency: 'INR',
        donation_id: donation._id,
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/donations/verify (Public)
router.post('/verify', async (req, res, next) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_FIELDS' } });
    }

    const donation = await Donation.findOne({
      razorpay_order_id,
      status: 'pending',
    });

    if (!donation) {
      return res.status(404).json({ success: false, error: { code: 'DONATION_NOT_FOUND' } });
    }

    const valid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!valid) {
      console.warn(`[DONATION] Signature mismatch for order ${razorpay_order_id}`);
      return res.status(400).json({ success: false, error: { code: 'PAYMENT_VERIFICATION_FAILED' } });
    }

    // Check duplicate (idempotency)
    const duplicate = await Donation.findOne({ razorpay_payment_id });
    if (duplicate) {
      return res.status(200).json({ success: true, data: { donation_id: duplicate._id } });
    }

    donation.razorpay_payment_id = razorpay_payment_id;
    donation.status = 'completed';
    await donation.save();

    console.info(`[DONATION] Donation ${donation._id} completed for ${donation.amount_inr} INR`);
    res.json({ success: true, data: { donation_id: donation._id } });

  } catch (error) {
    next(error);
  }
});

// GET /api/v1/donations (Admin only)
router.get('/', verifyFirebaseToken, attachUserFromDB, checkRole('admin'), async (req, res, next) => {
  try {
    const donations = await Donation.find()
      .populate('user_id', 'email display_name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: donations });
  } catch (error) {
    next(error);
  }
});

export default router;
