'use server'

import { dbConnect } from '../connectdatabase'
import Attendance from '../models/Attendance'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export async function getAllAttendances(): Promise<ApiResponse<any>> {
  try {
    await dbConnect()
    const attendances = await Attendance.find({})
      .populate('class', 'name subject')
      .populate('students.student', 'name')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
      .sort({ date: -1 })
      .lean()
      .exec()

    return {
      success: true,
      data: JSON.parse(JSON.stringify(attendances))
    }
  } catch (error) {
    console.error('Error fetching attendances:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch attendances'
    }
  }
}

export async function getAttendancesByClass(classId: string): Promise<ApiResponse<any>> {
  try {
    await dbConnect()
    const attendances = await Attendance.find({ class: classId })
      .populate('class', 'name subject')
      .populate('students.student', 'name')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
      .sort({ date: -1 })
      .lean()
      .exec()

    return {
      success: true,
      data: JSON.parse(JSON.stringify(attendances))
    }
  } catch (error) {
    console.error('Error fetching class attendances:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch class attendances'
    }
  }
}
