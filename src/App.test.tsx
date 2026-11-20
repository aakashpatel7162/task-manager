import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('TaskFlow Application UI & Workflows', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders application brand, header, and primary sections', () => {
    render(<App />);

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('Project Workspace')).toBeInTheDocument();
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getAllByText(/in progress/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Done').length).toBeGreaterThan(0);
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search by title/i)).toBeInTheDocument();
  });

  it('switches between Kanban Board and List view modes', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'To Do' })).toBeInTheDocument();

    const listBtn = screen.getByRole('button', { name: /list/i });
    fireEvent.click(listBtn);

    expect(screen.queryByRole('heading', { name: 'To Do' })).not.toBeInTheDocument();

    const boardBtn = screen.getByRole('button', { name: /board/i });
    fireEvent.click(boardBtn);
    expect(screen.getByRole('heading', { name: 'To Do' })).toBeInTheDocument();
  });

  it('filters tasks dynamically via search input', () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText(/search by title/i);

    fireEvent.change(searchInput, { target: { value: 'database index' } });
    expect(screen.getByText(/database index optimization/i)).toBeInTheDocument();
  });

  it('opens New Task modal, submits a new task, and renders it', () => {
    render(<App />);

    const newTaskBtn = screen.getByRole('button', { name: /new task/i });
    fireEvent.click(newTaskBtn);

    expect(screen.getByRole('heading', { name: /create new task/i })).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(/e\.g\. redesign authentication/i);
    fireEvent.change(titleInput, { target: { value: 'Ship Production Release v1' } });

    const descInput = screen.getByPlaceholderText(/add extra context/i);
    fireEvent.change(descInput, { target: { value: 'Complete final signoff and deployment' } });

    const submitBtn = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Ship Production Release v1')).toBeInTheDocument();
  });

  it('toggles dark mode theme on root html element', () => {
    render(<App />);

    const themeToggleBtn = screen.getByTitle(/switch to dark mode|switch to light mode/i);
    const initiallyDark = document.documentElement.classList.contains('dark');

    fireEvent.click(themeToggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(!initiallyDark);
  });
});
