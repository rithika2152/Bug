export interface User {
  id: string;
  email: string;
  name: string;
  role: 'developer' | 'manager';
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'pending-approval' | 'closed';
  assigneeId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags: string[];
  comments: Comment[];
  timeEntries: TimeEntry[];
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  duration: number; // in minutes
  description: string;
  date: Date;
}

export interface TaskStats {
  total: number;
  open: number;
  inProgress: number;
  pendingApproval: number;
  closed: number;
}

export interface DailyTaskData {
  date: string;
  tasks: number;
  timeSpent: number;
}