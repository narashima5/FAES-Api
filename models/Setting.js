import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  maintenance_mode: { type: Boolean, default: false },
  emergency_override: { type: Boolean, default: false },
  platform_title: { type: String, default: 'FAES Panel' },
  primary_color: { type: String, default: '#1976d2' }
}, { timestamps: true });

export default mongoose.model('Setting', settingSchema);
