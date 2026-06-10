import mongoose from 'mongoose';

const statisticSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    value: { type: Number, required: true, default: 0 },
    icon: String,
    suffix: String,
  },
  { timestamps: true }
);

export default mongoose.model('Statistic', statisticSchema);
