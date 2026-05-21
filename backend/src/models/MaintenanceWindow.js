import mongoose from 'mongoose';

const maintenanceWindowSchema = new mongoose.Schema({
  start_at: { type: Date, required: true },
  end_at: { type: Date, required: true },
  reason: { type: String },
  message: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  is_active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('MaintenanceWindow', maintenanceWindowSchema);
