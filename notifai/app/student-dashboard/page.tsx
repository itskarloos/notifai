'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { getAllAssignments } from '@/lib/database/actions/assignmentActions'
import { getAllAttendances } from '@/lib/database/actions/attendanceActions'
import { Progress } from '@/components/ui/progress'
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from 'recharts'

interface IAssignment {
  _id: string
  title: string
  deadline: Date
  totalMarks: number
}

interface IAttendance {
  _id: string
  date: Date
  status: 'present' | 'absent' | 'late'
}

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState<IAssignment[]>([])
  const [attendances, setAttendances] = useState<IAttendance[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentsResult, attendancesResult] = await Promise.all([
          getAllAssignments(),
          getAllAttendances()
        ])

        if (assignmentsResult.success && assignmentsResult.data) {
          setAssignments(assignmentsResult.data)
        }

        if (attendancesResult.success && attendancesResult.data) {
          setAttendances(attendancesResult.data)
        }
      } catch (err) {
        setError('Failed to fetch dashboard data')
      }
    }

    fetchData()
  }, [])

  // Calculate attendance statistics
  const totalClasses = attendances.length
  const presentCount = attendances.filter(a => a.status === 'present').length
  const attendancePercentage = totalClasses > 0 
    ? Math.round((presentCount / totalClasses) * 100) 
    : 0

  // Calculate assignment statistics
  const completedAssignments = assignments.filter(a => new Date(a.deadline) < new Date()).length
  const upcomingAssignments = assignments.filter(a => new Date(a.deadline) >= new Date()).length
  const totalAssignments = assignments.length

  // Performance data from assignments
  const performanceData = assignments.slice(0, 5).map(a => ({
    name: a.title,
    total: a.totalMarks
  }))

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Academic Progress Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Academic Progress</CardTitle>
            <CardDescription>Current Semester</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Attendance Rate</span>
                <span className="text-sm font-medium">{attendancePercentage}%</span>
              </div>
              <Progress value={attendancePercentage} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{completedAssignments}</p>
                <p className="text-xs text-muted-foreground">Assignments</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingAssignments}</p>
                <p className="text-xs text-muted-foreground">Deadlines</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
            <CardDescription>Last 5 Assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={performanceData}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tickFormatter={(value) => `${value}`}
                />
                <Bar
                  dataKey="total"
                  fill="rgb(124, 58, 237)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Calendar Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Academic Calendar</CardTitle>
            <CardDescription>Upcoming Events & Deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar 
              mode="single"
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}