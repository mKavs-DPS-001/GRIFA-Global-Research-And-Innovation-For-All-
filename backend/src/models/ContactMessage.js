import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  ip_address: { type: String },
  status: { type: String, enum: ['unread', 'read', 'archived'], default: 'unread' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('ContactMessage', contactMessageSchema);
