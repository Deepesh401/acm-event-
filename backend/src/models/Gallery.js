import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    imageUrl: { type: String, required: true },
    thumbnailUrl: String,
    category: {
      type: String,
      enum: ['events', 'team', 'competitions', 'workshops', 'campus', 'videos', 'other'],
      default: 'events',
    },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    eventName: String,
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    videoUrl: String,
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model('Gallery', gallerySchema);
