import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  chapters: mongoose.Types.ObjectId[];
}

const CourseSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    chapters: [{ type: Schema.Types.ObjectId, ref: 'Chapter' }],
  },
  { timestamps: true }
);

export default mongoose.model<ICourse>('Course', CourseSchema);
