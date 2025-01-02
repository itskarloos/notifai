'use server'

import {dbConnect} from '../connectdatabase'
import Assignment from "../models/Assignment"

export async function getAllAssignments() {
  try {
    await dbConnect()
    const assignments = await Assignment.find({})
      .sort({ deadline: 1 })
    
    return {
      success: true,
      data: JSON.parse(JSON.stringify(assignments))
    }
  } catch (error) {
    console.error('Error fetching assignments:', error)
    return {
      success: false,
      error: 'Failed to fetch assignments'
    }
  }
}