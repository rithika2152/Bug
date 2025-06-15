'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { Header } from '@/components/layout/Header';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TaskChart } from '@/components/dashboard/TaskChart';
import { TaskList } from '@/components/tasks/TaskList';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-blue-100 opacity-20 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700">Loading BugTracker</h3>
            <p className="text-sm text-gray-500">Preparing your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      <main className="container py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Welcome back, {user.name.split(' ')[0]}! 👋
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl">
            {user.role === 'manager' 
              ? 'Monitor your team\'s progress, review completed work, and ensure project milestones are met efficiently.'
              : 'Stay organized with your tasks, track your time, and collaborate effectively with your team.'
            }
          </p>
        </div>
        
        <StatsCards />
        <TaskChart />
        <TaskList />
      </main>
    </div>
  );
}