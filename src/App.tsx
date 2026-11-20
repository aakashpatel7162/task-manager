import React from 'react';
import { TaskProvider, useTaskContext } from './TaskContext';
import { Navbar } from './Navbar';
import { StatsOverview } from './StatsOverview';
import { FilterBar } from './FilterBar';
import { BoardView } from './BoardView';
import { ListView } from './ListView';
import { TaskModal } from './TaskModal';
import { ImportExportModal } from './ImportExportModal';

const DashboardContent: React.FC = () => {
  const { viewMode } = useTaskContext();

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <div className="workspace-header">
          <h1 className="workspace-title">
            Project Workspace
          </h1>
          <p className="workspace-subtitle">
            Organize, track progress, and complete high-priority deliverables effortlessly.
          </p>
        </div>

        <StatsOverview />
        <FilterBar />

        {viewMode === 'board' ? <BoardView /> : <ListView />}
      </main>

      <TaskModal />
      <ImportExportModal />
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <DashboardContent />
    </TaskProvider>
  );
}
