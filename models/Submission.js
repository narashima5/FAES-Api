import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activity_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  proof_url: { type: String },
  description: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  marks: { type: Number, default: 0 },
  comments: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);
