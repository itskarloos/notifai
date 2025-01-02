'use server'

import { revalidatePath } from 'next/cache'
import Teacher from '@/lib/database/models/Teacher'
import Class from '@/lib/database/models/Class'
import Student from '@/lib/database/models/Student'
import Attendance from '@/lib/database/models/Attendance'
import Assignment from '@/lib/database/models/Assignment'
import Test from '@/lib/database/models/Test'
import { dbConnect } from '@/lib/database/connectdatabase'

// Types
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

interface ClassData {
  name: string
  subject: string
  teacherId: string
}

interface AttendanceData {
  class: string
  date: Date
  present: string[]
  absent: string[]
}

interface AssignmentData {
  title: string
  description: string
  class: string
  deadline: Date
  totalMarks: number
}

interface TestData {
  title: string
  description: string
  class: string
  date: Date
  duration: number
  totalMarks: number
}

// Helper function for error handling
const handleDbOperation = async <T>(
  operation: () => Promise<T>, 
  revalidatePaths?: string[]
): Promise<ApiResponse<T>> => {
  try {
    await dbConnect()
    const result = await operation()
    // Revalidate multiple paths if provided
    revalidatePaths?.forEach(path => revalidatePath(path))
    return { success: true, data: result }
  } catch (error) {
    console.error('Database operation failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

// Main functions
export async function getTeacherClasses(teacherId: string) {
  return handleDbOperation(async () => {
    const classes = await Class.find({ teacher: teacherId })
      .populate('students', 'name')
      .lean()
      .exec()
    return JSON.parse(JSON.stringify(classes))
  })
}

export async function createClass(classData: ClassData) {
  return handleDbOperation(
    async () => {
      const newClass = await Class.create({
        name: classData.name,
        subject: classData.subject,
        teacher: classData.teacherId
      })
      return newClass
    },
    ['/teacher-dashboard', '/classes']
  )
}

export async function saveAttendance(data: AttendanceData) {
  return handleDbOperation(
    async () => {
      const attendance = await Attendance.create(data)
      return attendance
    },
    ['/teacher-dashboard', `/classes/${data.class}/attendance`]
  )
}

export async function createAssignment(data: AssignmentData) {
  return handleDbOperation(
    async () => {
      const assignment = await Assignment.create(data)
      return assignment
    },
    ['/teacher-dashboard', `/classes/${data.class}/assignments`]
  )
}

export async function createTest(data: TestData) {
  return handleDbOperation(
    async () => {
      const test = await Test.create(data)
      return test
    },
    ['/teacher-dashboard', `/classes/${data.class}/tests`]
  )
}

// Form handlers
export async function handleCreateClass(formData: FormData) {
  const classData: ClassData = {
    name: formData.get('name') as string,
    subject: formData.get('subject') as string,
    teacherId: formData.get('teacherId') as string || 'your-teacher-id',
  }

  if (!classData.name || !classData.subject) {
    return { success: false, error: 'Name and subject are required' }
  }

  return await createClass(classData)
}

export async function handleAttendance(attendanceData: AttendanceData) {
  if (!attendanceData.class || !attendanceData.date) {
    return { success: false, error: 'Class and date are required' }
  }
  
  return await saveAttendance(attendanceData)
}

export async function handleAssignment(formData: FormData) {
  const assignmentData: AssignmentData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    class: formData.get('class') as string,
    deadline: new Date(formData.get('deadline') as string),
    totalMarks: Number(formData.get('totalMarks'))
  }

  if (!assignmentData.title || !assignmentData.class) {
    return { success: false, error: 'Title and class are required' }
  }

  return await createAssignment(assignmentData)
}

export async function handleTest(formData: FormData) {
  const testData: TestData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    class: formData.get('class') as string,
    date: new Date(formData.get('date') as string),
    duration: Number(formData.get('duration')),
    totalMarks: Number(formData.get('totalMarks'))
  }

  if (!testData.title || !testData.class) {
    return { success: false, error: 'Title and class are required' }
  }

  return await createTest(testData)
}