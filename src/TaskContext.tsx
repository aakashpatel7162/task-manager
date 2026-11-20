import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Task,
  TaskFilters,
  TaskPriority,
  TaskStatus,
  TaskStatistics,
} from './types';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadThemeMode,
  saveThemeMode,
  calculateStatistics,
  exportTasksToJson,
  validateAndParseImport,
  INITIAL_TASKS,
} from './storage';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  stats: TaskStatistics;
  categories: string[];
  filters: TaskFilters;
  darkMode: boolean;
  isModalOpen: boolean;
  editingTask: Task | null;
  isImportModalOpen: boolean;
  viewMode: 'board' | 'list';
  setViewMode: (mode: 'board' | 'list') => void;
  setFilters: (updater: Partial<TaskFilters> | ((prev: TaskFilters) => TaskFilters)) => void;
  resetFilters: () => void;
  addTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'subtasks'> & { subtasks?: { title: string; completed: boolean }[] }) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  changeTaskStatus: (id: string, newStatus: TaskStatus) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  toggleDarkMode: () => void;
  exportData: () => void;
  importData: (jsonStr: string) => { success: boolean; count?: number; error?: string };
  resetToSampleData: () => void;
  openCreateModal: () => void;
  openEditModal: (task: Task) => void;
  closeModal: () => void;
  openImportModal: () => void;
  closeImportModal: () => void;
}

const defaultFilters: TaskFilters = {
  searchQuery: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [filters, setFiltersState] = useState<TaskFilters>(defaultFilters);
  const [darkMode, setDarkMode] = useState<boolean>(() => loadThemeMode());
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  useEffect(() => {
    saveThemeMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const setFilters = (updater: Partial<TaskFilters> | ((prev: TaskFilters) => TaskFilters)) => {
    if (typeof updater === 'function') {
      setFiltersState((prev) => updater(prev));
    } else {
      setFiltersState((prev) => ({ ...prev, ...updater }));
    }
  };

  const resetFilters = () => setFiltersState(defaultFilters);

  const categories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.category && t.category.trim()) {
        set.add(t.category.trim());
      }
    });
    return Array.from(set).sort();
  }, [tasks]);

  const priorityWeight: Record<TaskPriority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(q);
          const matchesDesc = task.description.toLowerCase().includes(q);
          const matchesCategory = task.category.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesCategory) return false;
        }

        if (filters.status !== 'all' && task.status !== filters.status) {
          return false;
        }

        if (filters.priority !== 'all' && task.priority !== filters.priority) {
          return false;
        }

        if (filters.category !== 'all' && task.category !== filters.category) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (filters.sortBy === 'dueDate') {
          if (!a.dueDate && !b.dueDate) comp = 0;
          else if (!a.dueDate) comp = 1;
          else if (!b.dueDate) comp = -1;
          else comp = a.dueDate.localeCompare(b.dueDate);
        } else if (filters.sortBy === 'priority') {
          comp = priorityWeight[b.priority] - priorityWeight[a.priority];
        } else if (filters.sortBy === 'title') {
          comp = a.title.localeCompare(b.title);
        } else {
          comp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return filters.sortOrder === 'asc' ? comp : -comp;
      });
  }, [tasks, filters]);

  const stats = useMemo(() => calculateStatistics(tasks), [tasks]);

  const addTask = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'subtasks'> & { subtasks?: { title: string; completed: boolean }[] }) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      status: data.status,
      priority: data.priority,
      category: data.category.trim() || 'General',
      dueDate: data.dueDate || undefined,
      subtasks: (data.subtasks || []).map((s, index) => ({
        id: `sub-${Date.now()}-${index}`,
        title: s.title.trim(),
        completed: s.completed,
      })),
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const changeTaskStatus = (id: string, newStatus: TaskStatus) => {
    updateTask(id, { status: newStatus });
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks.map((sub) =>
          sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        );
        return {
          ...t,
          subtasks: updatedSubtasks,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const exportData = () => {
    exportTasksToJson(tasks);
  };

  const importData = (jsonStr: string) => {
    const parsed = validateAndParseImport(jsonStr);
    if (!parsed) {
      return { success: false, error: 'Invalid JSON format or missing task fields.' };
    }
    setTasks(parsed);
    return { success: true, count: parsed.length };
  };

  const resetToSampleData = () => {
    setTasks(INITIAL_TASKS);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const openImportModal = () => setIsImportModalOpen(true);
  const closeImportModal = () => setIsImportModalOpen(false);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        stats,
        categories,
        filters,
        darkMode,
        isModalOpen,
        editingTask,
        isImportModalOpen,
        viewMode,
        setViewMode,
        setFilters,
        resetFilters,
        addTask,
        updateTask,
        deleteTask,
        changeTaskStatus,
        toggleSubtask,
        toggleDarkMode,
        exportData,
        importData,
        resetToSampleData,
        openCreateModal,
        openEditModal,
        closeModal,
        openImportModal,
        closeImportModal,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
