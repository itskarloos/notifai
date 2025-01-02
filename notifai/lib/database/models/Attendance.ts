import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  class: string;
  date: Date;
  students: Array<{
    student: string;
    status: 'present' | 'absent' | 'late';
    remarks?: string;
  }>;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  createdBy: string;
  updatedBy: string;
}

const AttendanceSchema: Schema = new Schema({
  class: { 
    type: Schema.Types.ObjectId, 
    ref: 'Class', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  students: [{
    student: { 
      type: Schema.Types.ObjectId, 
      ref: 'Student', 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['present', 'absent', 'late'], 
      required: true 
    },
    remarks: { 
      type: String 
    }
  }],
  totalPresent: { 
    type: Number, 
    default: 0 
  },
  totalAbsent: { 
    type: Number, 
    default: 0 
  },
  totalLate: { 
    type: Number, 
    default: 0 
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'Teacher', 
    required: true 
  },
  updatedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'Teacher', 
    required: true 
  }
}, {
  timestamps: true,
});

// Index for efficient querying
AttendanceSchema.index({ class: 1, date: 1 });

// Pre-save middleware to calculate totals
AttendanceSchema.pre('save', function(this: IAttendance, next) {
  const attendance = this;
  attendance.totalPresent = attendance.students.filter(s => s.status === 'present').length;
  attendance.totalAbsent = attendance.students.filter(s => s.status === 'absent').length;
  attendance.totalLate = attendance.students.filter(s => s.status === 'late').length;
  next();
}); 

export default mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);