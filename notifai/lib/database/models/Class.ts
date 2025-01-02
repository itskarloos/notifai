import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  subject: string;
  teacher: string;
  students: string[];
}

const ClassSchema: Schema = new Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
  students: [{ type: Schema.Types.ObjectId, ref: 'Student' }]
});

export default mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);