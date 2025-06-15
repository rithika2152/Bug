'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTasks } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@/lib/types';
import { users } from '@/lib/data';
import { Clock, Calendar, User } from 'lucide-react';

interface TimeTrackingDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TimeTrackingDialog({ task, open, onOpenChange }: TimeTrackingDialogProps) {
  const { addTimeEntry } = useTasks();
  const { user } = useAuth();
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !duration || !description) return;

    addTimeEntry(task.id, {
      taskId: task.id,
      userId: user.id,
      duration: parseFloat(duration) * 60, // Convert hours to minutes
      description,
      date: new Date(date),
    });

    setDuration('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    onOpenChange(false);
  };

  const getTotalTime = () => {
    const totalMinutes = task.timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return Math.round(totalMinutes / 60 * 10) / 10;
  };

  const getUserName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Unknown';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Time Tracking</DialogTitle>
          <DialogDescription>
            Log time spent on: {task.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Time Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Time Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {getTotalTime()}h
              </div>
              <p className="text-sm text-muted-foreground">
                Total time logged ({task.timeEntries.length} entries)
              </p>
            </CardContent>
          </Card>

          {/* Add New Time Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Log New Time Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Input
                      id="duration"
                      type="number"
                      step="0.25"
                      min="0.25"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 2.5"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what you worked on..."
                    rows={3}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Log Time
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Time Entries History */}
          {task.timeEntries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Time Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {task.timeEntries
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry) => (
                      <div key={entry.id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{entry.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{getUserName(entry.userId)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(entry.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 font-medium">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span>{Math.round(entry.duration / 60 * 10) / 10}h</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}