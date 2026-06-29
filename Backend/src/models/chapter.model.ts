import mongoose, { Schema, Document } from 'mongoose';

export interface IChapter extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  order: number;
  lessons: mongoose.Types.ObjectId[];
}

const ChapterSchema: Schema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  },
  { timestamps: true }
);

export default mongoose.model<IChapter>('Chapter', ChapterSchema);
