import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  noticeboard: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Department', departmentSchema);
