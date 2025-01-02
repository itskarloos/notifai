'use server'

import { dbConnect } from '../connectdatabase'
import Test from '../models/Test'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Add this interface to define the Test structure
interface Test {
  _id: string;
  title: string;
  description: string;
  class: string; // Just the ObjectId as string
  date: Date;
  duration: number;
  totalMarks: number;
}

export async function getAllTests(): Promise<ApiResponse<Test[]>> {
  try {
    await dbConnect()
    const tests = await Test.find()
      .lean()
      .exec()
    // Removed .populate('class', 'name') since we just want the ObjectId
    
    if (!tests || tests.length === 0) {
      return {
        success: false,
        error: 'No tests found'
      }
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(tests))
    }
  } catch (error) {
    console.error('Error fetching tests:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tests'
    }
  }
}
