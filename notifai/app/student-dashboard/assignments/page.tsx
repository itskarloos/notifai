'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { getAllAssignments } from '@/lib/database/actions/assignmentActions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface IAssignment {
  _id: string;
  title: string;
  deadline: Date;
  totalMarks: number;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<IAssignment[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const result = await getAllAssignments()
        if (result.success && result.data) {
          setAssignments(result.data)
        } else {
          setError(result.error || 'Failed to fetch assignments')
        }
      } catch (err) {
        setError('An error occurred while fetching assignments')
      }
    }

    fetchAssignments()
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Assignments</h1>
      
      <Card className="shadow-md">
        <CardHeader className="border-b bg-secondary/5">
          <CardTitle className="text-xl">All Assignments</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {assignments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No assignments found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total Marks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => {
                  // Calculate days until deadline
                  const today = new Date();
                  const deadline = new Date(assignment.deadline);
                  const diffTime = deadline.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  // Determine status color and text
                  let statusColor = "text-yellow-600 bg-yellow-50";
                  let statusText = `${diffDays} days left`;
                  
                  if (diffDays < 0) {
                    statusColor = "text-red-600 bg-red-50";
                    statusText = "Deadline passed";
                  } else if (diffDays === 0) {
                    statusColor = "text-orange-600 bg-orange-50";
                    statusText = "Due today";
                  } else if (diffDays === 1) {
                    statusText = "Due tomorrow";
                  }

                  return (
                    <TableRow key={assignment._id} className="hover:bg-secondary/5">
                      <TableCell className="font-medium">{assignment.title}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <span className="text-muted-foreground">📅</span>
                          {new Date(assignment.deadline).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium ${statusColor}`}>
                          {statusText}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="flex items-center justify-end gap-2">
                          <span className="text-muted-foreground">📊</span>
                          {assignment.totalMarks}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}