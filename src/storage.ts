import { Task, TaskStatistics } from './types';

const STORAGE_KEY = 'taskflow_tasks_v1';
const DARK_MODE_KEY = 'taskflow_theme_mode';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Research UI component libraries & design tokens',
    description: 'Compare Vanilla CSS variables, tokens, and modern flex/grid layouts for accessibility and speed.',
    status: 'completed',
    priority: 'medium',
    category: 'Engineering',
    dueDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-1', title: 'Audit bundle size and rendering performance', completed: true },
      { id: 'sub-2', title: 'Review accessibility (WAI-ARIA) patterns', completed: true },
      { id: 'sub-3', title: 'Document findings in architecture notes', completed: true },
    ],
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Build modern responsive Task Manager application',
    description: 'Implement full CRUD workflow, Kanban board, sorting, filtering, priority badges, and JSON backup export.',
    status: 'in_progress',
    priority: 'urgent',
    category: 'Engineering',
    dueDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-4', title: 'Design component hierarchy and state architecture', completed: true },
      { id: 'sub-5', title: 'Implement local persistence with error fallback', completed: true },
      { id: 'sub-6', title: 'Add animated status progression controls', completed: true },
      { id: 'sub-7', title: 'Write unit tests and verification suite', completed: true },
    ],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Record technical architecture presentation video',
    description: 'Cover key design decisions, deliberate trade-offs, and future roadmap in a concise presentation.',
    status: 'todo',
    priority: 'high',
    category: 'Product',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-8', title: 'Outline key decision points and technical trade-offs', completed: true },
      { id: 'sub-9', title: 'Prepare speaking script & key takeaways', completed: true },
      { id: 'sub-10', title: 'Record video facing the camera', completed: false },
    ],
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Conduct weekly database index optimization',
    description: 'Analyze slow query logs, assess high-cardinality foreign keys, and update vacuum schedules.',
    status: 'todo',
    priority: 'low',
    category: 'DevOps',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-11', title: 'Run EXPLAIN ANALYZE on top 5 slowest queries', completed: false },
      { id: 'sub-12', title: 'Review memory cache hit ratio', completed: false },
    ],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Prepare quarterly sprint retrospective report',
    description: 'Gather feedback from frontend, backend, and design team leads regarding velocity and blockers.',
    status: 'todo',
    priority: 'medium',
    category: 'Management',
    dueDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-13', title: 'Consolidate sprint burndown metrics', completed: true },
      { id: 'sub-14', title: 'Highlight process bottlenecks & action items', completed: false },
    ],
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const loadTasksFromStorage = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveTasksToStorage(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_TASKS;
  } catch (err) {
    console.error('Failed to parse tasks from localStorage:', err);
    return INITIAL_TASKS;
  }
};

export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage:', err);
  }
};

export const loadThemeMode = (): boolean => {
  try {
    const saved = localStorage.getItem(DARK_MODE_KEY);
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
};

export const saveThemeMode = (isDark: boolean): void => {
  try {
    localStorage.setItem(DARK_MODE_KEY, String(isDark));
  } catch (err) {
    console.error('Failed to save theme to localStorage:', err);
  }
};

export const calculateStatistics = (tasks: Task[]): TaskStatistics => {
  const total = tasks.length;
  let todo = 0;
  let inProgress = 0;
  let completed = 0;
  let overdue = 0;

  const todayStr = new Date().toISOString().split('T')[0];

  tasks.forEach((task) => {
    if (task.status === 'completed') {
      completed++;
    } else if (task.status === 'in_progress') {
      inProgress++;
    } else {
      todo++;
    }

    if (task.status !== 'completed' && task.dueDate && task.dueDate < todayStr) {
      overdue++;
    }
  });

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    todo,
    inProgress,
    completed,
    overdue,
    completionRate,
  };
};

export const exportTasksToJson = (tasks: Task[]): void => {
  const dataStr = JSON.stringify(tasks, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  anchor.href = url;
  anchor.download = `taskflow-backup-${dateStr}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const validateAndParseImport = (jsonStr: string): Task[] | null => {
  try {
    const data = JSON.parse(jsonStr);
    if (!Array.isArray(data)) return null;

    const validTasks = data.filter((item) => {
      return (
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        ['todo', 'in_progress', 'completed'].includes(item.status)
      );
    });

    return validTasks.length > 0 ? (validTasks as Task[]) : null;
  } catch (e) {
    console.error('Error parsing import JSON:', e);
    return null;
  }
};
