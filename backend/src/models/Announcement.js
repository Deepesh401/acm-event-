import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'warning', 'success', 'live'], default: 'info' },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
    expiresAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Announcement', announcementSchema);
