import mongoose, { Schema, Document } from 'mongoose';

export interface ITest extends Document {
  title: string;
  description: string;
  class: string;
  date: Date;
  duration: number;
  totalMarks: number;
}

const TestSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  totalMarks: { type: Number, required: true }
}, {
  timestamps: true
});

export default mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);