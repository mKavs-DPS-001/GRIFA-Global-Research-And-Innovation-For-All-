import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebase_uid: { type: String, required: true, unique: true },
  email: { type: String },
  display_name: { type: String },
  photo_url: { type: String },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
