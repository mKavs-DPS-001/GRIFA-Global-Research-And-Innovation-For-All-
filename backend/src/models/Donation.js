import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, can be anonymous
  amount_inr: { type: Number, required: true },
  pan_number: { type: String }, // Stored securely (e.g., encrypted in real-world, plain text for prototype)
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  donor_name: { type: String },
  donor_email: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Donation', donationSchema);
