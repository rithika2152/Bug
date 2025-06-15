'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task, TaskStats } from '@/lib/types';
import { useTasks } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { Bug, Clock, CheckCircle, AlertTriangle, TrendingUp, Target } from 'lucide-react';

export function StatsCards() {
  const { tasks } = useTasks();
  const { user } = useAuth();

  const getUserTasks = () => {
    if (user?.role === 'manager') {
      return tasks;
    }
    return tasks.filter(task => task.assigneeId === user?.id);
  };

  const userTasks = getUserTasks();

  const stats: TaskStats = {
    total: userTasks.length,
    open: userTasks.filter(task => task.status === 'open').length,
    inProgress: userTasks.filter(task => task.status === 'in-progress').length,
    pendingApproval: userTasks.filter(task => task.status === 'pending-approval').length,
    closed: userTasks.filter(task => task.status === 'closed').length,
  };

  const totalTimeSpent = userTasks.reduce((total, task) => {
    return total + task.timeEntries.reduce((taskTotal, entry) => taskTotal + entry.duration, 0);
  }, 0);

  const completionRate = stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0;

  const cards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      description: `${Math.round(totalTimeSpent / 60)}h logged`,
      trend: '+12%',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      borderColor: 'border-amber-200',
      description: 'Active work',
      trend: '+5%',
    },
    {
      title: 'Pending Review',
      value: stats.pendingApproval,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      description: 'Awaiting approval',
      trend: '-2%',
    },
    {
      title: 'Completed',
      value: stats.closed,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      description: `${completionRate}% completion rate`,
      trend: '+8%',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className={`card-hover border-2 ${card.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative`}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
          
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">
              {card.title}
            </CardTitle>
            <div className={`p-3 rounded-xl ${card.bgColor} shadow-sm`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold text-gray-900">{card.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-600 font-medium">{card.trend}</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 font-medium">
              {card.description}
            </p>
            
            {/* Progress bar for visual appeal */}
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full bg-gradient-to-r ${
                  index === 0 ? 'from-blue-400 to-blue-600' :
                  index === 1 ? 'from-amber-400 to-amber-600' :
                  index === 2 ? 'from-orange-400 to-orange-600' :
                  'from-emerald-400 to-emerald-600'
                }`}
                style={{ width: `${Math.min((card.value / Math.max(...cards.map(c => c.value))) * 100, 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}