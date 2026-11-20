import React from 'react';
import { useTaskContext } from './TaskContext';
import { CheckCircle2, Clock, AlertTriangle, Layers } from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const { stats, setFilters, filters } = useTaskContext();

  return (
    <div className="stats-grid">
      <button
        type="button"
        onClick={() => setFilters({ status: 'all' })}
        className={`stat-card clickable ${filters.status === 'all' ? 'active-filter' : ''}`}
      >
        <div className="stat-card-header">
          <span className="stat-card-label">Total Tasks</span>
          <Layers size={16} color="#0284c7" />
        </div>
        <div className="stat-card-body">
          <span className="stat-card-number">{stats.total}</span>
          <span className="stat-card-subtext">items</span>
        </div>
      </button>

      <button
        type="button"
        onClick={() => setFilters({ status: 'in_progress' })}
        className={`stat-card clickable ${filters.status === 'in_progress' ? 'active-filter' : ''}`}
      >
        <div className="stat-card-header">
          <span className="stat-card-label">In Progress</span>
          <Clock size={16} color="#f59e0b" />
        </div>
        <div className="stat-card-body">
          <span className="stat-card-number">{stats.inProgress}</span>
          <span className="stat-card-subtext highlight-progress">active</span>
        </div>
      </button>

      <button
        type="button"
        onClick={() => setFilters({ status: 'completed' })}
        className={`stat-card clickable ${filters.status === 'completed' ? 'active-filter' : ''}`}
      >
        <div className="stat-card-header">
          <span className="stat-card-label">Done</span>
          <CheckCircle2 size={16} color="#10b981" />
        </div>
        <div className="stat-card-body">
          <span className="stat-card-number">{stats.completed}</span>
          <span className="stat-card-subtext highlight-success">
            {stats.completionRate}%
          </span>
        </div>
      </button>

      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-card-label">Overdue</span>
          <AlertTriangle size={16} color={stats.overdue > 0 ? '#ef4444' : '#94a3b8'} />
        </div>
        <div className="stat-card-body">
          <span className={`stat-card-number ${stats.overdue > 0 ? 'highlight-danger' : ''}`}>
            {stats.overdue}
          </span>
          <span className="stat-card-subtext">
            {stats.overdue > 0 ? 'require attention' : 'on track'}
          </span>
        </div>
      </div>
    </div>
  );
};
