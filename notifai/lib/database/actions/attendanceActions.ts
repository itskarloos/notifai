'use server';

import { dbConnect } from '../connectdatabase';
import Attendance from '../models/Attendance';
import '../models/Student';
import '../models/Class';
import '../models/Teacher';
import { Types } from 'mongoose';
import { headers } from 'next/headers';

interface ClassInfo {
  _id: string;
  name: string;
  subject: string;
}

interface StudentInfo {
  _id: string;
  name: string;
}

interface TeacherInfo {
  name
  : string;

}

interface StudentAttendance {
  student: StudentInfo;
  status: 'present' | 'absent' | 'late';
  remarks?: string;
}

interface SanitizedAttendance {
  _id: string;
  class: string;
  date: Date;
  students: Array<{
    student: string;
    status: 'present' | 'absent' | 'late';
  }>;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getAllAttendances(): Promise<ApiResponse<SanitizedAttendance[]>> {
  try {
    await dbConnect();
    const attendances = await Attendance.find({})
      .sort({ date: -1 })
      .lean()
      .exec();
    const sanitizedAttendances = attendances.map(attendance => ({
      _id: attendance._id?.toString() ?? '',
      class: attendance.class?.toString() ?? '',
      date: new Date(attendance.date),
      students: attendance.students?.map((student: {
        student: Types.ObjectId;
        status: string;
        _id: Types.ObjectId
      }) => ({
        student: student.student.toString(),
        status: student.status as 'present' | 'absent' | 'late',
      })),
      totalPresent: Number(attendance.totalPresent),
      totalAbsent: Number(attendance.totalAbsent),
      totalLate: Number(attendance.totalLate),
      createdBy: attendance.createdBy.toString(),
      updatedBy: attendance.updatedBy.toString(),
      createdAt: new Date(attendance.createdAt),
      updatedAt: new Date(attendance.updatedAt),
    }));

    return {
      success: true,
      data: sanitizedAttendances,
    };
  } catch (error) {
    console.error('Error fetching attendances:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch attendances',
    };
  }
}
