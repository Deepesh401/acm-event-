import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: String,
    category: {
      type: String,
      enum: ['ai-ml', 'web-development', 'iot', 'open-source', 'research'],
      required: true,
    },
    technologies: [String],
    coverImage: String,
    images: [String],
    githubUrl: String,
    liveUrl: String,
    teamMembers: [String],
    status: { type: String, enum: ['completed', 'in-progress', 'archived'], default: 'completed' },
    isFeatured: { type: Boolean, default: false },
    stats: {
      stars: { type: Number, default: 0 },
      forks: { type: Number, default: 0 },
      contributors: { type: Number, default: 0 },
    },
    startDate: Date,
    endDate: Date,
    tags: [String],
  },
  { timestamps: true }
);

projectSchema.index({ title: 'text', description: 'text', technologies: 'text' });

export default mongoose.model('Project', projectSchema);
