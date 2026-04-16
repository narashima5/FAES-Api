import mongoose from 'mongoose';

const subSectionSchema = new mongoose.Schema({
  section_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  title: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('SubSection', subSectionSchema);
