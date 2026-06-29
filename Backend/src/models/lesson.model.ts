import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
  chapterId: mongoose.Types.ObjectId;
  title: string;
  duration: string;
  videoUrl: string;
  order: number;
}

const LessonSchema: Schema = new Schema(
  {
    chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
    title: { type: String, required: true },
    duration: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ILesson>('Lesson', LessonSchema);
