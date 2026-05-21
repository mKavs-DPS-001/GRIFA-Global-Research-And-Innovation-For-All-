import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String },
  disciplines: [String],
  tags: [String],
  is_featured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Problem', problemSchema);
