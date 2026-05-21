import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export async function createOrder({ amount_inr, receipt, notes }) {
  if (process.env.NODE_ENV !== 'production' && !process.env.RAZORPAY_KEY_ID) {
    // Return dummy order in dev if no Razorpay keys are set
    return { id: `order_dummy_${Date.now()}`, amount: amount_inr * 100, currency: 'INR' };
  }
  return rzp.orders.create({
    amount: amount_inr * 100, // Razorpay uses paise
    currency: 'INR',
    receipt,
    notes,
  });
}

export function verifySignature(orderId, paymentId, signature) {
  if (process.env.NODE_ENV !== 'production' && !process.env.RAZORPAY_KEY_SECRET) {
    return true; // Bypass in dev if no keys
  }
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(signature, 'hex')
  );
}
