import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  email: string;
  classes: string[];
}

const StudentSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  classes: [{ type: Schema.Types.ObjectId, ref: 'Class' }]
});

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);