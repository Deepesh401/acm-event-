import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rollNumber: String,
    branch: String,
    year: String,
    phone: String,
    acmMembershipId: String,
    joinDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    interests: [String],
    skills: [String],
    github: String,
    linkedin: String,
  },
  { timestamps: true }
);

export default mongoose.model('Member', memberSchema);
