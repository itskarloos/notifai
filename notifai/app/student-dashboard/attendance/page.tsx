'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AttendanceRecord {
  _id: string
  date: Date
  class: {
    name: string
    subject: string
  }
  status: 'present' | 'absent' | 'late'
  remarks?: string
  student: {
    _id: string
    name: string
  }
}

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // TODO: Replace with actual API call
        // Mocking data for now
        const mockData: AttendanceRecord[] = [
          {
            _id: '1',
            date: new Date('2024-03-20'),
            class: {
              name: 'N8',
              subject: 'AI'
            },
            status: 'present',
            student: {
              _id: '65f1f143d5e38e0d8b111111',
              name: 'Nahom Teguade'
            }
          },
          {
            _id: '2',
            date: new Date('2024-03-19'),
            class: {
              name: 'N8',
              subject: 'AI'
            },
            status: 'absent',
            remarks: 'Medical leave',
            student: {
              _id: '65f1f143d5e38e0d8b222222',
              name: 'Lukman Ali'
            }
          }
        ]
        setAttendanceRecords(mockData)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch attendance records')
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [])

  const filteredRecords = attendanceRecords.filter(record => {
    const searchTerm = searchQuery.toLowerCase()
    return (
      record.class.name.toLowerCase().includes(searchTerm) ||
      record.class.subject.toLowerCase().includes(searchTerm) ||
      record.status.toLowerCase().includes(searchTerm)
    )
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'present':
        return 'default'
      case 'absent':
        return 'destructive'
      case 'late':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Attendance Records</CardTitle>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{record.student.name}</TableCell>
                    <TableCell>{record.class.name}</TableCell>
                    <TableCell>{record.class.subject}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.remarks || '-'}</TableCell>
                  </TableRow>
                ))}
                {filteredRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}