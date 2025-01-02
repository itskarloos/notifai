'use server'

import { revalidatePath } from 'next/cache'
import Assignment, { IAssignment } from '@/lib/database/models/Assignment'
import { dbConnect } from '@/lib/database/connectdatabase'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

const handleDbOperation = async <T>(
  operation: () => Promise<T>, 
  revalidatePaths?: string[]
): Promise<ApiResponse<T>> => {
  try {
    await dbConnect()
    const result = await operation()
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

export async function getStudentAssignments(classId: string) {
  return handleDbOperation(async () => {
    const assignments = await Assignment.find({
      class: classId
    })
      .populate('class', 'name')
      .lean()
      .exec()
    return JSON.parse(JSON.stringify(assignments))
  })
}