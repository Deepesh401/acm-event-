import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    content: { type: String, required: true },
    coverImage: String,
    author: { type: String, required: true },
    authorImage: String,
    category: {
      type: String,
      enum: ['technical', 'event-report', 'member-story', 'newsletter'],
      default: 'technical',
    },
    tags: [String],
    readTime: Number,
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.model('Blog', blogSchema);
