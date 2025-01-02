import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  name: string;
  email: string;
  classes: string[];
}

const TeacherSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  classes: [{ type: Schema.Types.ObjectId, ref: 'Class' }]
});

export default mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);