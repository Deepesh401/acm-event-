import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: {
      type: String,
      enum: ['competition', 'hackathon', 'certification', 'acm-recognition', 'award', 'participation'],
      required: true,
    },
    date: { type: Date, required: true },
    position: String,
    organization: String,
    image: String,
    certificateUrl: String,
    participants: [String],
    isFeatured: { type: Boolean, default: false },
    stats: {
      teams: Number,
      participants: Number,
      hours: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Achievement', achievementSchema);
