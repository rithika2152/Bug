'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTasks } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { DailyTaskData } from '@/lib/types';

export function TaskChart() {
  const { tasks } = useTasks();
  const { user } = useAuth();

  const getUserTasks = () => {
    if (user?.role === 'manager') {
      return tasks;
    }
    return tasks.filter(task => task.assigneeId === user?.id);
  };

  const userTasks = getUserTasks();

  // Generate last 7 days of data
  const generateChartData = (): DailyTaskData[] => {
    const data: DailyTaskData[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Count tasks worked on that day (based on time entries)
      const tasksWorkedOn = userTasks.filter(task => 
        task.timeEntries.some(entry => 
          entry.date.toISOString().split('T')[0] === dateString
        )
      ).length;
      
      // Calculate total time spent that day
      const timeSpent = userTasks.reduce((total, task) => {
        const dayEntries = task.timeEntries.filter(entry => 
          entry.date.toISOString().split('T')[0] === dateString
        );
        return total + dayEntries.reduce((sum, entry) => sum + entry.duration, 0);
      }, 0);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tasks: tasksWorkedOn,
        timeSpent: Math.round(timeSpent / 60 * 10) / 10, // Convert to hours with 1 decimal
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Task Activity Trend</CardTitle>
        <CardDescription>
          Daily task activity and time tracking over the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Date
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {label}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Tasks Worked
                          </span>
                          <span className="font-bold">
                            {payload[0]?.value}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Time Spent
                          </span>
                          <span className="font-bold text-emerald-600">
                            {payload[1]?.value}h
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="tasks" 
              strokeWidth={2} 
              stroke="#3B82F6"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="timeSpent" 
              strokeWidth={2} 
              stroke="#10B981"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}