import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollment extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrolledAt: Date;
  progress: number;
  status: string;
}

const EnrollmentSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }, // percentage 0-100
    status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
  },
  { timestamps: true }
);

// Prevent duplicate enrollments
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
