import { ReactNode } from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export default function StudentDashboardLayout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-indigo-600">Student Portal</h2>
        </div>
        <nav className="mt-6">
          <ul className="space-y-1">
            <li>
              <Link 
                href="/student-dashboard"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
              >
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/student-dashboard/assignments"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
              >
                <span>Assignments</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/student-dashboard/attendance"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
              >
                <span>Attendance</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/student-dashboard/tests"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
              >
                <span>Tests</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
