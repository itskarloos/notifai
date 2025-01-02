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
import { getAllAttendances } from '@/lib/database/actions/attendanceActions'

interface AttendanceRecord {
  _id: string
  date: Date
  class: string
  students: Array<{
    student: string
    status: 'present' | 'absent' | 'late'
    remarks?: string
  }>
  totalPresent: number
  totalAbsent: number
  totalLate: number
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}

const studentNameMap: { [key: string]: string } = {
  "65f1f143d5e38e0d8b111111": "Nahom Teguade",
  "65f1f143d5e38e0d8b222222": "Lukman Ali",
  "65f1f143d5e38e0d8b333333": "Nebyou Yohannes",
  "65f1f143d5e38e0d8b444444": "Arsema Haileyesus",
};

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const result = await getAllAttendances()
        if (result.success && result.data) {
          setAttendanceRecords(result.data)
        } else {
          throw new Error(result.error || 'Failed to fetch attendance')
        }
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
      record.class.toLowerCase().includes(searchTerm) ||
      record.students.some(student => 
        student.status.toLowerCase().includes(searchTerm)
      )
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
                  <TableHead>Class</TableHead>
                  <TableHead>Total Present</TableHead>
                  <TableHead>Total Absent</TableHead>
                  <TableHead>Total Late</TableHead>
                  <TableHead>Students</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{"N8"}</TableCell>
                    <TableCell>{record.totalPresent}</TableCell>
                    <TableCell>{record.totalAbsent}</TableCell>
                    <TableCell>{record.totalLate}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {record.students.map((student, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span>{studentNameMap[student.student] || student.student}</span>
                            <Badge variant={getStatusBadgeVariant(student.status)}>
                              {student.status}
                            </Badge>
                            {student.remarks && <span className="text-sm text-gray-500">({student.remarks})</span>}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
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