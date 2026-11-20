import React from 'react';
import { useTaskContext } from './TaskContext';
import {
  CheckSquare,
  Plus,
  LayoutGrid,
  List,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    darkMode,
    toggleDarkMode,
    openCreateModal,
    openImportModal,
    exportData,
    resetToSampleData,
    tasks,
  } = useTaskContext();

  const handleReset = () => {
    if (window.confirm('Reset all tasks back to the default sample dataset? Any unsaved custom tasks will be overwritten.')) {
      resetToSampleData();
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-wrapper">
          <div className="brand-logo">
            <CheckSquare size={20} strokeWidth={2.5} />
          </div>
          <div className="brand-details">
            <div className="brand-title-row">
              <span className="brand-name">TaskFlow</span>
              <span className="brand-tag">v1.0</span>
            </div>
            <p className="brand-caption">
              Intuitive, high-performance task management
            </p>
          </div>
        </div>

        <div className="view-mode-selector">
          <button
            type="button"
            onClick={() => setViewMode('board')}
            className={`view-mode-btn ${viewMode === 'board' ? 'active' : ''}`}
          >
            <LayoutGrid size={15} />
            Board
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
          >
            <List size={15} />
            List
          </button>
        </div>

        <div className="navbar-actions">
          <button
            type="button"
            onClick={exportData}
            title={`Export ${tasks.length} tasks to JSON backup`}
            className="icon-btn"
          >
            <Download size={17} />
          </button>

          <button
            type="button"
            onClick={openImportModal}
            title="Import tasks from JSON file"
            className="icon-btn"
          >
            <Upload size={17} />
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Reset to sample tasks"
            className="icon-btn"
          >
            <RotateCcw size={17} />
          </button>

          <button
            type="button"
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="icon-btn"
          >
            {darkMode ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} />}
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="btn-primary"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
