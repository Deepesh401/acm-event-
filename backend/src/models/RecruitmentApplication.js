import mongoose from 'mongoose';

const recruitmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    rollNumber: String,
    branch: String,
    year: String,
    type: { type: String, enum: ['membership', 'volunteer', 'recruitment'], default: 'membership' },
    team: {
      type: String,
      enum: ['technical', 'design', 'events', 'content', 'general'],
    },
    motivation: String,
    password: { type: String },
    experience: String,
    portfolio: String,
    github: String,
    linkedin: String,
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending',
    },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('RecruitmentApplication', recruitmentSchema);
