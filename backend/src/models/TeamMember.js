import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'faculty',
        'chairperson',
        'vice-chairperson',
        'core-committee',
        'technical',
        'design',
        'events',
        'alumni',
      ],
      required: true,
    },
    bio: String,
    image: String,
    email: String,
    linkedin: String,
    github: String,
    twitter: String,
    portfolio: String,
    year: String,
    department: String,
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    tenureStart: Date,
    tenureEnd: Date,
  },
  { timestamps: true }
);

export default mongoose.model('TeamMember', teamMemberSchema);
