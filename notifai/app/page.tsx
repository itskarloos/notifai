import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto pt-20 px-4">
        <main className="flex flex-col items-center text-center gap-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Welcome to NotifAI
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            Your intelligent educational platform that connects teachers and students
            for a better learning experience.
          </p>

          <div className="flex gap-6 mt-8 flex-col sm:flex-row">
            <a
              href="/teacher-dashboard"
              className="transform hover:scale-105 transition-all px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Teacher Dashboard
              <span className="block text-sm opacity-90 mt-1">
                Manage your classes and students
              </span>
            </a>

            <a
              href="/student-dashboard"
              className="transform hover:scale-105 transition-all px-8 py-4 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
            >
              Student Dashboard
              <span className="block text-sm opacity-90 mt-1">
                Access your courses and assignments
              </span>
            </a>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
              <h3 className="text-xl font-semibold mb-2">Smart Learning</h3>
              <p className="text-gray-600 dark:text-gray-300">
                AI-powered personalized learning paths
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
              <h3 className="text-xl font-semibold mb-2">Real-time Feedback</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Instant assessment and progress tracking
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enhanced teacher-student interaction
              </p>
            </div>
          </div>
        </main>

        <footer className="mt-20 mb-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 NotifAI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
