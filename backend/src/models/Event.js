import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: String,
  bio: String,
  image: String,
  linkedin: String,
  github: String,
});

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: String,
    category: {
      type: String,
      enum: ['workshop', 'hackathon', 'seminar', 'competition', 'meetup', 'summit', 'other'],
      default: 'workshop',
    },
    date: { type: Date, required: true },
    endDate: Date,
    location: String,
    venue: String,
    isOnline: { type: Boolean, default: false },
    meetingLink: String,
    coverImage: String,
    gallery: [String],
    speakers: [speakerSchema],
    registrationLimit: Number,
    registrationCount: { type: Number, default: 0 },
    isLive: { type: Boolean, default: false },
    isUpcoming: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    report: String,
    resources: [{ title: String, url: String, type: String }],
    certificates: [{ title: String, url: String }],
    tags: [String],
    attendanceCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Event', eventSchema);
