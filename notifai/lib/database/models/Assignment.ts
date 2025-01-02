import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAssignment extends Document {
  _id: string;
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

// Check if the model exists before creating a new one
let Assignment: Model<IAssignment>;
try {
  Assignment = mongoose.model<IAssignment>('Assignment');
} catch {
  Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
}

export default Assignment;