import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  description: string;
  class: string;
  deadline: Date;
  totalMarks: number;
}

const AssignmentSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  deadline: { type: Date, required: true },
  totalMarks: { type: Number, required: true }
}, {
  timestamps: true
});

export default mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);