import React from 'react';
import { useTaskContext } from './TaskContext';
import { TaskPriority, TaskStatus, SortByField } from './types';
import { Search, X, ArrowUpDown, Filter } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, categories, filteredTasks, tasks } = useTaskContext();

  const isFiltered =
    filters.searchQuery.trim() !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== 'all';

  return (
    <div className="filter-bar">
      <div className="filter-top-row">
        <div className="search-field-wrapper">
          <Search size={16} className="search-field-icon" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            placeholder="Search by title, description, or category..."
            className="search-input"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => setFilters({ searchQuery: '' })}
              className="search-clear-btn"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="sort-group">
          <div className="control-label">
            <ArrowUpDown size={14} />
            <span>Sort by:</span>
          </div>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ sortBy: e.target.value as SortByField })}
            className="select-control"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Alphabetical</option>
          </select>
          <button
            type="button"
            onClick={() =>
              setFilters({
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
              })
            }
            className="btn-secondary"
          >
            {filters.sortOrder === 'asc' ? 'Asc ↑' : 'Desc ↓'}
          </button>
        </div>
      </div>

      <div className="filter-bottom-row">
        <div className="filters-list">
          <div className="control-label">
            <Filter size={14} />
            <span>Filters:</span>
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value as 'all' | TaskStatus })}
            className="select-control"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ priority: e.target.value as 'all' | TaskPriority })}
            className="select-control"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters({ category: e.target.value })}
            className="select-control"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="btn-reset-filters"
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="results-counter">
          Showing <strong>{filteredTasks.length}</strong> of {tasks.length} tasks
        </div>
      </div>
    </div>
  );
};
