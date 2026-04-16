import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  submission_deadline: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Setting', settingSchema);
