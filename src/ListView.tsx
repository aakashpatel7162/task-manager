import React from 'react';
import { useTaskContext } from './TaskContext';
import { Task, TaskPriority, TaskStatus } from './types';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Pencil,
  Trash2,
  AlertCircle,
} from 'lucide-react';

export const ListView: React.FC = () => {
  const { filteredTasks, changeTaskStatus, openEditModal, deleteTask } = useTaskContext();

  const priorityClasses: Record<TaskPriority, string> = {
    urgent: 'priority-urgent',
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const handleToggle = (task: Task) => {
    const nextStatus: TaskStatus = task.status === 'completed' ? 'todo' : 'completed';
    changeTaskStatus(task.id, nextStatus);
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="list-view-container" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No tasks match your active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="list-view-container">
      {filteredTasks.map((task) => {
        const isOverdue = task.dueDate && task.dueDate < todayStr && task.status !== 'completed';
        const isDone = task.status === 'completed';

        return (
          <div
            key={task.id}
            className={`list-view-item ${isDone ? 'is-done' : ''}`}
          >
            <div className="list-left-content">
              <button
                type="button"
                onClick={() => handleToggle(task)}
                className={`checkbox-toggle-btn ${isDone ? 'checked' : ''}`}
              >
                {isDone ? (
                  <CheckCircle2 size={18} color="#10b981" />
                ) : (
                  <Circle size={18} />
                )}
              </button>

              <div className="list-text-details">
                <div className="list-title-line">
                  <span
                    onClick={() => openEditModal(task)}
                    className={`list-title ${isDone ? 'strikethrough' : ''}`}
                  >
                    {task.title}
                  </span>

                  <span className="category-pill">
                    {task.category}
                  </span>

                  <span className={`priority-pill ${priorityClasses[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>

                {task.description && (
                  <p className="list-description">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            <div className="list-middle-meta">
              {task.subtasks.length > 0 && (
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                  {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks
                </span>
              )}

              {task.dueDate && (
                <div className={`date-indicator ${isOverdue ? 'is-overdue' : ''}`}>
                  {isOverdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
                  <span>{task.dueDate}</span>
                </div>
              )}

              <select
                value={task.status}
                onChange={(e) => changeTaskStatus(task.id, e.target.value as TaskStatus)}
                className="select-control"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Done</option>
              </select>
            </div>

            <div className="list-actions">
              <button
                type="button"
                onClick={() => openEditModal(task)}
                title="Edit task"
                className="icon-btn"
              >
                <Pencil size={15} />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete task "${task.title}"?`)) {
                    deleteTask(task.id);
                  }
                }}
                title="Delete task"
                className="icon-btn"
                style={{ color: 'var(--danger-text)' }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
