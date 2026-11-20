import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateStatistics,
  validateAndParseImport,
  loadTasksFromStorage,
  saveTasksToStorage,
  INITIAL_TASKS,
} from './storage';
import { Task } from './types';

describe('Storage & Analytics Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('calculates correct task statistics including completion rate and overdue count', () => {
    const today = new Date().toISOString().split('T')[0];
    const pastDate = '2020-01-01';
    const futureDate = '2099-01-01';

    const sampleTasks: Task[] = [
      {
        id: 't-1',
        title: 'Task 1',
        description: '',
        status: 'completed',
        priority: 'high',
        category: 'Work',
        dueDate: pastDate,
        subtasks: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 't-2',
        title: 'Task 2',
        description: '',
        status: 'in_progress',
        priority: 'urgent',
        category: 'Work',
        dueDate: pastDate,
        subtasks: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 't-3',
        title: 'Task 3',
        description: '',
        status: 'todo',
        priority: 'low',
        category: 'Personal',
        dueDate: futureDate,
        subtasks: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 't-4',
        title: 'Task 4',
        description: '',
        status: 'todo',
        priority: 'medium',
        category: 'Personal',
        dueDate: today,
        subtasks: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ];

    const stats = calculateStatistics(sampleTasks);
    expect(stats.total).toBe(4);
    expect(stats.completed).toBe(1);
    expect(stats.inProgress).toBe(1);
    expect(stats.todo).toBe(2);
    expect(stats.overdue).toBe(1);
    expect(stats.completionRate).toBe(25);
  });

  it('validates and parses valid JSON import data', () => {
    const validJson = JSON.stringify([
      {
        id: 'custom-1',
        title: 'Imported Task',
        description: 'Test description',
        status: 'todo',
        priority: 'high',
        category: 'Imported',
        subtasks: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ]);

    const result = validateAndParseImport(validJson);
    expect(result).not.toBeNull();
    expect(result?.length).toBe(1);
    expect(result?.[0].title).toBe('Imported Task');
  });

  it('rejects invalid or corrupted JSON payloads', () => {
    expect(validateAndParseImport('not json')).toBeNull();
    expect(validateAndParseImport('{"not": "an array"}')).toBeNull();
    expect(validateAndParseImport('[]')).toBeNull();
    expect(validateAndParseImport('[{"id": 123}]')).toBeNull();
  });

  it('loads fallback seed tasks if localStorage is empty', () => {
    const tasks = loadTasksFromStorage();
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks).toEqual(INITIAL_TASKS);
  });

  it('saves and reloads custom tasks from storage', () => {
    const customTasks: Task[] = [
      {
        id: 'saved-1',
        title: 'Persistent Task',
        description: 'Testing storage',
        status: 'todo',
        priority: 'urgent',
        category: 'Dev',
        subtasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    saveTasksToStorage(customTasks);
    const loaded = loadTasksFromStorage();
    expect(loaded.length).toBe(1);
    expect(loaded[0].title).toBe('Persistent Task');
  });
});
