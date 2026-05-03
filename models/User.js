import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['staff', 'hod', 'iqac', 'management', 'admin'], 
    required: true 
  },
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: function() { return this.role === 'staff' || this.role === 'hod'; } },
  monthly_target: { type: Number, default: null }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
