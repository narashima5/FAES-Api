import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('Section', sectionSchema);
