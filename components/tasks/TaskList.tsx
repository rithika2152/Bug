'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTasks } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@/lib/types';
import { users } from '@/lib/data';
import { 
  Search, 
  Plus, 
  Clock, 
  User, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Circle,
  Pause,
  Filter,
  Star,
  Zap
} from 'lucide-react';
import { TaskDialog } from './TaskDialog';
import { TimeTrackingDialog } from './TimeTrackingDialog';

export function TaskList() {
  const { tasks, updateTask } = useTasks();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isTimeDialogOpen, setIsTimeDialogOpen] = useState(false);

  const getUserTasks = () => {
    if (user?.role === 'manager') {
      return tasks;
    }
    return tasks.filter(task => task.assigneeId === user?.id);
  };

  const filteredTasks = getUserTasks().filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical': 
        return { 
          class: 'priority-critical border-red-200 shadow-red-100', 
          badge: 'bg-red-100 text-red-800 border-red-200',
          icon: <Zap className="h-3 w-3" />
        };
      case 'high': 
        return { 
          class: 'priority-high border-orange-200 shadow-orange-100', 
          badge: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: <AlertTriangle className="h-3 w-3" />
        };
      case 'medium': 
        return { 
          class: 'priority-medium border-yellow-200 shadow-yellow-100', 
          badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Star className="h-3 w-3" />
        };
      case 'low': 
        return { 
          class: 'priority-low border-green-200 shadow-green-100', 
          badge: 'bg-green-100 text-green-800 border-green-200',
          icon: <Circle className="h-3 w-3" />
        };
      default: 
        return { 
          class: 'border-gray-200 shadow-gray-100', 
          badge: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Circle className="h-3 w-3" />
        };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Circle className="h-4 w-4 text-blue-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'pending-approval': return <Pause className="h-4 w-4 text-orange-500" />;
      case 'closed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Circle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open': return { class: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Open' };
      case 'in-progress': return { class: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'In Progress' };
      case 'pending-approval': return { class: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Pending Review' };
      case 'closed': return { class: 'bg-green-100 text-green-800 border-green-200', label: 'Completed' };
      default: return { class: 'bg-gray-100 text-gray-800 border-gray-200', label: status };
    }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateTask(taskId, { status: newStatus as Task['status'] });
  };

  const getAssigneeName = (assigneeId: string) => {
    return users.find(u => u.id === assigneeId)?.name || 'Unknown';
  };

  const getTotalTime = (task: Task) => {
    const totalMinutes = task.timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return Math.round(totalMinutes / 60 * 10) / 10;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {user?.role === 'manager' ? 'All Tasks' : 'My Tasks'}
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
          </p>
        </div>
        <Button 
          onClick={() => setIsTaskDialogOpen(true)} 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>Create Task</span>
        </Button>
      </div>

      {/* Enhanced Filters */}
      <Card className="border-2 border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-11 border-gray-200">
                  <Filter className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending-approval">Pending Review</SelectItem>
                  <SelectItem value="closed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[160px] h-11 border-gray-200">
                  <Star className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Task Cards */}
      <div className="grid gap-6">
        {filteredTasks.map((task) => {
          const priorityConfig = getPriorityConfig(task.priority);
          const statusConfig = getStatusConfig(task.status);
          
          return (
            <Card key={task.id} className={`card-hover border-2 ${priorityConfig.class} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative`}>
              {/* Priority indicator line */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                task.priority === 'critical' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                task.priority === 'high' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                task.priority === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                'bg-gradient-to-r from-green-500 to-green-600'
              }`}></div>

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-xl font-bold text-gray-900">{task.title}</CardTitle>
                      {task.priority === 'critical' && (
                        <div className="animate-pulse">
                          <Zap className="h-4 w-4 text-red-500" />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 ml-4">
                    <Badge className={`${priorityConfig.badge} border font-semibold px-3 py-1 status-indicator`}>
                      <div className="flex items-center space-x-1">
                        {priorityConfig.icon}
                        <span className="capitalize">{task.priority}</span>
                      </div>
                    </Badge>
                    <Badge variant="outline" className={`${statusConfig.class} border font-semibold px-3 py-1 status-indicator`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(task.status)}
                        <span>{statusConfig.label}</span>
                      </div>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <User className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{getAssigneeName(task.assigneeId)}</span>
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                        <Calendar className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{task.dueDate.toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">{getTotalTime(task)}h logged</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {user?.role === 'developer' && task.assigneeId === user.id && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTask(task);
                            setIsTimeDialogOpen(true);
                          }}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Log Time
                        </Button>
                        
                        {task.status === 'open' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(task.id, 'in-progress')}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                          >
                            Start Work
                          </Button>
                        )}
                        
                        {task.status === 'in-progress' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(task.id, 'pending-approval')}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                          >
                            Submit for Review
                          </Button>
                        )}
                      </>
                    )}
                    
                    {user?.role === 'manager' && task.status === 'pending-approval' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(task.id, 'in-progress')}
                          className="border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Reopen
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(task.id, 'closed')}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task);
                        setIsTaskDialogOpen(true);
                      }}
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                
                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <Card className="p-12 text-center border-2 border-dashed border-gray-200">
          <div className="text-gray-400 space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Circle className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                  : 'Get started by creating your first task to track your work and progress.'
                }
              </p>
              {(!searchTerm && statusFilter === 'all' && priorityFilter === 'all') && (
                <Button 
                  onClick={() => setIsTaskDialogOpen(true)}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Task
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Dialogs */}
      <TaskDialog
        task={selectedTask}
        open={isTaskDialogOpen}
        onOpenChange={(open) => {
          setIsTaskDialogOpen(open);
          if (!open) setSelectedTask(null);
        }}
      />
      
      {selectedTask && (
        <TimeTrackingDialog
          task={selectedTask}
          open={isTimeDialogOpen}
          onOpenChange={setIsTimeDialogOpen}
        />
      )}
    </div>
  );
}