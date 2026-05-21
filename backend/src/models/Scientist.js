import mongoose from 'mongoose';

const scientistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  institution: String,
  specialization: String,
  tags: [String],
  image_url: String,
  disciplines: [String],
  status: { type: String, enum: ['pending', 'active', 'revoked'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Scientist', scientistSchema);
