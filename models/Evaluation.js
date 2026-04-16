import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  submission_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission', required: true },
  evaluator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  marks: { type: Number, required: true },
  comments: { type: String },
}, { timestamps: true });

export default mongoose.model('Evaluation', evaluationSchema);
