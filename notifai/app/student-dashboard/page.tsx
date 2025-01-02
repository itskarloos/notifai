'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState([
    { id: 1, title: 'Math Homework', dueDate: '2024-03-25', status: 'pending' },
    { id: 2, title: 'English Essay', dueDate: '2024-03-28', status: 'completed' },
  ])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Assignments Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div 
                  key={assignment.id} 
                  className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                  </div>
                  <Badge variant={assignment.status === 'completed' ? 'secondary' : 'default'}>
                    {assignment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendar Card */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar 
              mode="single"
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full">View All Assignments</Button>
              <Button className="w-full" variant="outline">Schedule Meeting</Button>
              <Button className="w-full" variant="outline">View Resources</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
