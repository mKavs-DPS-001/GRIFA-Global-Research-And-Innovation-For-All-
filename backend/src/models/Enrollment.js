import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String },
  amount_paid_inr: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'active', 'cancelled'], default: 'pending' },
  enrolled_at: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Enrollment', enrollmentSchema);
