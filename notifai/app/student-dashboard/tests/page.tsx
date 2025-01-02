'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllTests } from '@/lib/database/actions/testAction'

interface ITest {
  _id: string
  title: string
  description: string
  class: string
  date: Date
  duration: number
  totalMarks: number
}

export default function TestSchedulePage() {
  const [tests, setTests] = useState<ITest[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true)
        const result = await getAllTests()
        if (result.success && result.data) {
          setTests(result.data)
        } else {
          setError(result.error || 'Failed to fetch tests')
        }
      } catch (err) {
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours > 0 ? `${hours}h ` : ''}${remainingMinutes}min`
  }

  if (loading) {
    return <div className="p-6">Loading tests...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Test Schedule</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Total Marks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test._id}>
                    <TableCell className="font-medium">{test.title}</TableCell>
                    <TableCell>{"N8"}</TableCell>
                    <TableCell>{formatDate(new Date(test.date))}</TableCell>
                    <TableCell>{formatDuration(test.duration)}</TableCell>
                    <TableCell>{test.totalMarks}</TableCell>
                  </TableRow>
                ))}
                {tests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No tests scheduled
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}