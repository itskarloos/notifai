'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { getTeacherClasses, saveAttendance, createAssignment, createTest, createClass } from '@/lib/database/actions/teacherActions';

interface Class {
  _id: string;
  name: string;
  subject: string;
  students: Student[];
}

interface Student {
  _id: string;
  name: string;
}

interface Assignment {
  _id: string;
  title: string;
  deadline: Date;
  class: string;
}

interface Test {
  _id: string;
  title: string;
  date: Date;
  class: string;
}

// Add mock teacher constant using valid MongoDB ObjectId format
const MOCK_TEACHER_ID = '65f1f143d5e38e0d8b123456';  // 24-character hex string

// Mock Data
const MOCK_CLASSES: Class[] = [
  {
    _id: "65f1f143d5e38e0d8b654321",
    name: "N8",
    subject: "AI",
    students: [
      { _id: "65f1f143d5e38e0d8b111111", name: "Nahom Teguade" },
      { _id: "65f1f143d5e38e0d8b222222", name: "Lukman Ali" },
      { _id: "65f1f143d5e38e0d8b333333", name: "Nebyou Yohannes" },
      { _id: "65f1f143d5e38e0d8b444444", name: "Arsema Haileyesus" },
    ]
  }
];

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [attendance, setAttendance] = useState<Set<string>>(new Set());
  const [showAttendance, setShowAttendance] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);

  // Fetch teacher's classes
  useEffect(() => {
    setClasses(MOCK_CLASSES);
    setLoading(false);
  }, []);

  const handleAttendance = async () => {
    if (!selectedClass) return;
    
    setLoading(true);
    setError(null);
    
    const attendanceData = {
      class: selectedClass,
      date: new Date(),
      students: classes
        .find(c => c._id === selectedClass)
        ?.students.map(student => ({
          student: student._id,
          status: attendance.has(student._id) ? 'present' : 'absent'
        })) || [],
      createdBy: MOCK_TEACHER_ID,
      updatedBy: MOCK_TEACHER_ID,
      present: Array.from(attendance),
      absent: classes
        .find(c => c._id === selectedClass)
        ?.students
        .filter(student => !attendance.has(student._id))
        .map(student => student._id) || []
    };

    try {
      const response = await saveAttendance(attendanceData);
      if (response?.success) {
        setShowAttendance(false);
        setAttendance(new Set());
        setSuccessMessage('Attendance saved successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response?.error || 'Failed to save attendance');
      }
    } catch (error) {
      setError('Saved successfully');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignment = async (formData: FormData) => {
    setAssignmentError(null);
    const assignmentData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      class: selectedClass,
      deadline: new Date(formData.get('deadline') as string),
      totalMarks: Number(formData.get('totalMarks'))
    };

    try {
      const response = await createAssignment(assignmentData);
      if (response?.success) {
        setShowAssignmentForm(false);
        setSuccessMessage('Assignment created successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setAssignmentError(response?.error || 'Failed to create assignment');
      }
    } catch (error) {
      setAssignmentError('Failed to create assignment');
      console.error('Failed to create assignment:', error);
    }
  };

  const handleTest = async (formData: FormData) => {
    const testData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      class: selectedClass,
      date: new Date(formData.get('date') as string),
      duration: Number(formData.get('duration')),
      totalMarks: Number(formData.get('totalMarks'))
    };

    try {
      await createTest(testData);
      setShowTestForm(false);
      setSuccessMessage('Test scheduled successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Failed to create test:', error);
    }
  };

  const handleCreateClass = async (formData: FormData) => {
    const classData = {
      name: formData.get('name') as string,
      subject: formData.get('subject') as string,
      teacherId: MOCK_TEACHER_ID,
    };

    try {
      await createClass(classData);
      const fetchedClasses = await getTeacherClasses(classData.teacherId);
      const plainClasses = fetchedClasses.data.map((cls: any) => ({
        _id: cls._id.toString(),
        name: cls.name,
        subject: cls.subject,
        students: cls.students.map((student: any) => ({
          _id: student._id.toString(),
          name: student.name
        }))
      }));
      setClasses(plainClasses);
      setShowCreateClass(false);
      setSuccessMessage('Class created successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Failed to create class:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
      
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Create Class Button */}
      <div className="mb-6 flex justify-between items-center">
        <select 
          className="border p-2 rounded"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map(c => (
            <option key={c._id} value={c._id}>{c.name} - {c.subject}</option>
          ))}
        </select>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowCreateClass(!showCreateClass)}
        >
          Create New Class
        </button>
      </div>

      {/* Create Class Form */}
      {showCreateClass && (
        <div className="mb-6 border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Create New Class</h2>
          <form action={handleCreateClass} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Class Name"
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="border p-2 w-full rounded"
              required
            />
            <button 
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Create Class
            </button>
          </form>
        </div>
      )}

      {selectedClass && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attendance Section */}
          <div className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Attendance</h2>
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowAttendance(!showAttendance)}
            >
              Take Attendance
            </button>

            {showAttendance && (
              <div className="mt-4">
                {classes.find(c => c._id === selectedClass)?.students.map(student => (
                  <div key={student._id} className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id={student._id}
                      checked={attendance.has(student._id)}
                      onChange={(e) => {
                        const newAttendance = new Set(attendance);
                        if (e.target.checked) {
                          newAttendance.add(student._id);
                        } else {
                          newAttendance.delete(student._id);
                        }
                        setAttendance(newAttendance);
                      }}
                    />
                    <label htmlFor={student._id}>{student.name}</label>
                  </div>
                ))}
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                  onClick={handleAttendance}
                >
                  Save Attendance
                </button>
              </div>
            )}
          </div>

          {/* Assignment Section */}
          <div className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Assignments</h2>
            {assignmentError && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                {assignmentError}
              </div>
            )}
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowAssignmentForm(!showAssignmentForm)}
            >
              Add Assignment
            </button>

            {showAssignmentForm && (
              <form action={handleAssignment} className="mt-4 space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Assignment Title"
                  className="border p-2 w-full rounded"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  className="border p-2 w-full rounded"
                  required
                />
                <input
                  type="datetime-local"
                  name="deadline"
                  className="border p-2 w-full rounded"
                  required
                />
                <input
                  type="number"
                  name="totalMarks"
                  placeholder="Total Marks"
                  className="border p-2 w-full rounded"
                  required
                />
                <button 
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save Assignment
                </button>
              </form>
            )}
          </div>

          {/* Test Section */}
          <div className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Tests</h2>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowTestForm(!showTestForm)}
            >
              Schedule Test
            </button>

            {showTestForm && (
              <form action={handleTest} className="mt-4 space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Test Title"
                  className="border p-2 w-full rounded"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  className="border p-2 w-full rounded"
                  required
                />
                <input
                  type="datetime-local"
                  name="date"
                  className="border p-2 w-full rounded"
                  required
                />
                <input
                  type="number"
                  name="duration"
                  placeholder="Duration (minutes)"
                  className="border p-2 w-full rounded"
                  required
                />
                <input
                  type="number"
                  name="totalMarks"
                  placeholder="Total Marks"
                  className="border p-2 w-full rounded"
                  required
                />
                <button 
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Save Test
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}