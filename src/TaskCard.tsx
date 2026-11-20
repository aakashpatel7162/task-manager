import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from './types';
import { useTaskContext } from './TaskContext';
import {
  Calendar,
  CheckCircle2,
  Circle,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { openEditModal, deleteTask, changeTaskStatus, toggleSubtask } = useTaskContext();
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = task.dueDate && task.dueDate < todayStr && task.status !== 'completed';
  const isDueToday = task.dueDate === todayStr;

  const priorityClasses: Record<TaskPriority, string> = {
    urgent: 'priority-urgent',
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  };

  const statusProgress: Record<TaskStatus, TaskStatus> = {
    todo: 'in_progress',
    in_progress: 'completed',
    completed: 'todo',
  };

  const completedSubtasksCount = task.subtasks.filter((s) => s.completed).length;

  return (
    <div className={`task-card ${task.status === 'completed' ? 'is-completed' : ''}`}>
      <div className="task-card-header">
        <div className="badge-group">
          <span className={`priority-pill ${priorityClasses[task.priority]}`}>
            {task.priority}
          </span>
          <span className="category-pill">
            {task.category}
          </span>
        </div>

        <div className="card-options-wrapper">
          <button
            type="button"
            onClick={() => setShowMenu((prev) => !prev)}
            className="icon-btn"
            style={{ width: '1.8rem', height: '1.8rem' }}
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div
              className="dropdown-popup"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  openEditModal(task);
                }}
                className="dropdown-item"
              >
                <Pencil size={14} />
                Edit Task
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  changeTaskStatus(task.id, statusProgress[task.status]);
                }}
                className="dropdown-item"
              >
                <CheckCircle2 size={14} />
                {task.status === 'completed' ? 'Reopen' : 'Advance'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  if (window.confirm(`Delete task "${task.title}"?`)) {
                    deleteTask(task.id);
                  }
                }}
                className="dropdown-item danger"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h3
        className={`task-title ${task.status === 'completed' ? 'strikethrough' : ''}`}
        onClick={() => openEditModal(task)}
      >
        {task.title}
      </h3>

      {task.description && (
        <p className="task-description">
          {task.description}
        </p>
      )}

      {task.subtasks.length > 0 && (
        <div className="subtasks-container">
          <button
            type="button"
            onClick={() => setShowSubtasks((prev) => !prev)}
            className="subtasks-header-toggle"
          >
            <span>
              Subtasks ({completedSubtasksCount}/{task.subtasks.length})
            </span>
            {showSubtasks ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${(completedSubtasksCount / task.subtasks.length) * 100}%`,
              }}
            />
          </div>

          {showSubtasks && (
            <div className="subtasks-items-list">
              {task.subtasks.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => toggleSubtask(task.id, sub.id)}
                  className={`subtask-row ${sub.completed ? 'is-done' : ''}`}
                >
                  {sub.completed ? (
                    <CheckCircle2 size={14} color="#10b981" />
                  ) : (
                    <Circle size={14} color="#94a3b8" />
                  )}
                  <span>{sub.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="task-card-footer">
        {task.dueDate ? (
          <div
            className={`date-indicator ${
              isOverdue ? 'is-overdue' : isDueToday ? 'is-due-today' : ''
            }`}
          >
            {isOverdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
            <span>
              {isOverdue ? `Overdue (${task.dueDate})` : isDueToday ? 'Due Today' : task.dueDate}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-disabled)', fontStyle: 'italic' }}>
            No due date
          </span>
        )}

        <select
          value={task.status}
          onChange={(e) => changeTaskStatus(task.id, e.target.value as TaskStatus)}
          className="select-control"
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Done</option>
        </select>
      </div>
    </div>
  );
};
