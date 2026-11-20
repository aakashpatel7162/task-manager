export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  dueDate?: string; // YYYY-MM-DD
  subtasks: Subtask[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export type SortByField = 'dueDate' | 'priority' | 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface TaskFilters {
  searchQuery: string;
  status: 'all' | TaskStatus;
  priority: 'all' | TaskPriority;
  category: string;
  sortBy: SortByField;
  sortOrder: SortOrder;
}

export interface TaskStatistics {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
  completionRate: number;
}
