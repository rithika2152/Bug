import { User, Task, TimeEntry } from './types';

// Mock users
export const users: User[] = [
  {
    id: '1',
    email: 'dev@example.com',
    name: 'John Developer',
    role: 'developer',
  },
  {
    id: '2',
    email: 'manager@example.com', 
    name: 'Sarah Manager',
    role: 'manager',
  },
  {
    id: '3',
    email: 'dev2@example.com',
    name: 'Alice Smith',
    role: 'developer',
  },
];

// Mock tasks
export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Fix login authentication bug',
    description: 'Users are unable to login after password reset. The session token appears to be corrupted.',
    priority: 'high',
    status: 'in-progress',
    assigneeId: '1',
    createdBy: '2',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    dueDate: new Date('2024-01-20'),
    tags: ['authentication', 'urgent'],
    comments: [],
    timeEntries: [
      {
        id: '1',
        taskId: '1',
        userId: '1',
        duration: 120,
        description: 'Investigating session token issue',
        date: new Date('2024-01-16'),
      }
    ],
  },
  {
    id: '2',
    title: 'Implement dark mode toggle',
    description: 'Add a dark mode toggle to the application header with proper theme persistence.',
    priority: 'medium',
    status: 'open',
    assigneeId: '3',
    createdBy: '2',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    dueDate: new Date('2024-01-25'),
    tags: ['ui', 'enhancement'],
    comments: [],
    timeEntries: [],
  },
  {
    id: '3',
    title: 'Database performance optimization',
    description: 'Query performance has degraded significantly. Need to optimize database indexes and queries.',
    priority: 'critical',
    status: 'pending-approval',
    assigneeId: '1',
    createdBy: '1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-17'),
    dueDate: new Date('2024-01-18'),
    tags: ['database', 'performance'],
    comments: [],
    timeEntries: [
      {
        id: '2',
        taskId: '3',
        userId: '1',
        duration: 240,
        description: 'Analyzing slow queries',
        date: new Date('2024-01-16'),
      },
      {
        id: '3',
        taskId: '3',
        userId: '1',
        duration: 180,
        description: 'Implementing index optimizations',
        date: new Date('2024-01-17'),
      }
    ],
  },
  {
    id: '4',
    title: 'API rate limiting implementation',
    description: 'Implement rate limiting for public API endpoints to prevent abuse.',
    priority: 'medium',
    status: 'closed',
    assigneeId: '3',
    createdBy: '2',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
    dueDate: new Date('2024-01-15'),
    tags: ['api', 'security'],
    comments: [],
    timeEntries: [
      {
        id: '4',
        taskId: '4',
        userId: '3',
        duration: 300,
        description: 'Implementing rate limiting middleware',
        date: new Date('2024-01-10'),
      }
    ],
  },
];