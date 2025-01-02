'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { getAllAssignments } from '@/lib/database/actions/assignmentActions'
import { getAllTests } from '@/lib/database/actions/testAction'
import { Progress } from '@/components/ui/progress'
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from 'recharts'

interface IAssignment {
  _id: string
  title: string
  deadline: Date
  totalMarks: number
}

interface ITest {
  _id: string;
  title: string;
  date: Date;
  totalMarks: number;
  scoredMarks?: number;
}

interface IPerformanceData {
  name: string
  total: number
  scored?: number  // Adding scored marks
}

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState<IAssignment[]>([])
  const [tests, setTests] = useState<ITest[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentsResult, testsResult] = await Promise.all([
          getAllAssignments(),
          getAllTests()
        ])

        if (assignmentsResult.success && assignmentsResult.data) {
          setAssignments(assignmentsResult.data)
        }

        if (testsResult.success && testsResult.data) {
          setTests(testsResult.data)
        }
      } catch (err) {
        setError('Failed to fetch dashboard data')
      }
    }

    fetchData()
  }, [])

  // Calculate test statistics
  const totalTests = tests.length
  const completedTests = tests.filter(t => new Date(t.date) < new Date()).length
  const upcomingTests = tests.filter(t => new Date(t.date) >= new Date()).length
  const averageScore = completedTests > 0
    ? Math.round(tests.reduce((sum, t) => sum + (t.scoredMarks || 0), 0) / completedTests)
    : 0

  // Calculate assignment statistics
  const completedAssignments = assignments.filter(a => new Date(a.deadline) < new Date()).length
  const upcomingAssignments = assignments.filter(a => new Date(a.deadline) >= new Date()).length
  const totalAssignments = assignments.length

  // Enhanced performance data
  const performanceData: IPerformanceData[] = assignments
    .slice(0, 5)
    .map(a => ({
      name: a.title.length > 15 ? `${a.title.substring(0, 15)}...` : a.title,
      total: a.totalMarks,
      scored: Math.floor(Math.random() * a.totalMarks) // Replace with actual scored marks
    }))

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Academic Progress Card */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Current Semester Attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Attendance Rate</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Total Classes: 45</span>
                <span>Present: 38</span>
                <span>Absent: 7</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-xs text-muted-foreground">Attendance Rate</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Last Month</p>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-xs text-muted-foreground">Attendance Rate</p>
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
                  angle={-45}
                  textAnchor="end"
                  height={60}
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
                  name="Total Marks"
                />
                <Bar
                  dataKey="scored"
                  fill="rgb(34, 197, 94)"
                  radius={[4, 4, 0, 0]}
                  name="Scored Marks"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Calendar Card with highlighted dates */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Academic Calendar</CardTitle>
            <CardDescription>
              Upcoming Deadlines & Tests
              <div className="mt-2 text-xs flex gap-4">
                <span className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-violet-500 mr-1"></div>
                  Assignments
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  Tests
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar 
              mode="single"
              className="rounded-md border"
              modifiers={{
                assignment: assignments.map(a => new Date(a.deadline)),
                test: tests.map(t => new Date(t.date))
              }}
              modifiersStyles={{
                assignment: { color: 'rgb(124, 58, 237)' },
                test: { color: 'rgb(34, 197, 94)' }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}