import React, { useState, useEffect } from 'react';
import { useTaskContext } from './TaskContext';
import { TaskPriority, TaskStatus } from './types';
import { X, Plus, Trash2, Calendar, Tag, AlertCircle } from 'lucide-react';

export const TaskModal: React.FC = () => {
  const { isModalOpen, closeModal, editingTask, addTask, updateTask, categories } = useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState('General');
  const [customCategory, setCustomCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState<{ title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setCategory(editingTask.category);
      setDueDate(editingTask.dueDate || '');
      setSubtasks(editingTask.subtasks.map((s) => ({ title: s.title, completed: s.completed })));
      setCustomCategory('');
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setCategory('Engineering');
      setDueDate('');
      setSubtasks([]);
      setCustomCategory('');
    }
    setError('');
  }, [editingTask, isModalOpen]);

  if (!isModalOpen) return null;

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks((prev) => [...prev, { title: newSubtaskTitle.trim(), completed: false }]);
      setNewSubtaskTitle('');
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    const finalCategory = category === '__custom__' ? customCategory.trim() || 'General' : category;

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        category: finalCategory,
        dueDate: dueDate || undefined,
        subtasks: subtasks.map((s, idx) => ({
          id: editingTask.subtasks[idx]?.id || `sub-${Date.now()}-${idx}`,
          title: s.title,
          completed: s.completed,
        })),
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        category: finalCategory,
        dueDate: dueDate || undefined,
        subtasks,
      });
    }

    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-header">
          <h2 className="modal-title">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="icon-btn"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert-message alert-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Task Title <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Redesign authentication flow"
                className="text-input"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add extra context, specifications, or links..."
                rows={3}
                className="text-area"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="select-control"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="select-control"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Tag size={13} />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="select-control"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  {!categories.includes('Engineering') && <option value="Engineering">Engineering</option>}
                  {!categories.includes('Product') && <option value="Product">Product</option>}
                  {!categories.includes('Personal') && <option value="Personal">Personal</option>}
                  <option value="__custom__">+ Custom Category...</option>
                </select>
                {category === '__custom__' && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category"
                    className="text-input"
                    style={{ marginTop: '0.4rem' }}
                  />
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={13} />
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="text-input"
                />
              </div>
            </div>

            <div className="form-group" style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                Subtasks Checklist
              </label>

              <div className="subtasks-edit-list">
                {subtasks.map((sub, index) => (
                  <div key={index} className="subtask-edit-item">
                    <span>{sub.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(index)}
                      className="icon-btn"
                      style={{ width: '1.6rem', height: '1.6rem', color: 'var(--danger-text)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="subtask-input-row">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  placeholder="Add subtask and press enter..."
                  className="text-input"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={closeModal}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
