import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  section_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  sub_section_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SubSection' },
  title: { type: String, required: true },
  max_marks: { type: Number, required: true },
  criteria: { type: String },
  proof_type: { type: String, enum: ['file', 'link', 'both'], required: true }
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema);
