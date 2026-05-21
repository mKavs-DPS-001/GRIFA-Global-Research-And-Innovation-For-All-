import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price_inr: { type: Number, required: true },
  features: [String],
  is_active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Plan', planSchema);
