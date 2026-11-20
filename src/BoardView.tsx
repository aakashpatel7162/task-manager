import React from 'react';
import { useTaskContext } from './TaskContext';
import { TaskCard } from './TaskCard';
import { TaskStatus } from './types';
import { Plus, ListTodo, PlayCircle, CheckCircle2 } from 'lucide-react';

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  icon: React.ReactNode;
  cssClass: string;
}

export const BoardView: React.FC = () => {
  const { filteredTasks, openCreateModal } = useTaskContext();

  const columns: ColumnConfig[] = [
    {
      id: 'todo',
      title: 'To Do',
      icon: <ListTodo size={16} color="#64748b" />,
      cssClass: 'todo-column',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: <PlayCircle size={16} color="#f59e0b" />,
      cssClass: 'in-progress-column',
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: <CheckCircle2 size={16} color="#10b981" />,
      cssClass: 'completed-column',
    },
  ];

  return (
    <div className="board-grid">
      {columns.map((col) => {
        const columnTasks = filteredTasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className={`board-column ${col.cssClass}`}
          >
            <div className="column-header">
              <div className="column-title-group">
                {col.icon}
                <h3 className="column-title">{col.title}</h3>
                <span className="column-counter-badge">
                  {columnTasks.length}
                </span>
              </div>

              {col.id === 'todo' && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  title="Quick add task"
                  className="icon-btn"
                  style={{ width: '1.8rem', height: '1.8rem' }}
                >
                  <Plus size={16} />
                </button>
              )}
            </div>

            <div className="tasks-stack">
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => <TaskCard key={task.id} task={task} />)
              ) : (
                <div className="empty-column-state">
                  No tasks in {col.title}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
