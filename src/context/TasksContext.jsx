import React, { createContext, useState, useEffect } from 'react';

export const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('dailyTasks');
    return stored ? JSON.parse(stored) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showAllTasksPage, setShowAllTasksPage] = useState(false);

  // Filters / search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Persist tasks
  useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
    };
    setTasks((s) => [...s, newTask]);
    setShowModal(false);
    setEditingTask(null);
  };

  const updateTask = (id, updated) => {
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    setShowModal(false);
    setEditingTask(null);
  };

  const removeTask = (id) => {
    setTasks((s) => s.filter((t) => t.id !== id));
  };

  const openAddModal = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const openAllTasksPage = () => setShowAllTasksPage(true);
  const closeAllTasksPage = () => setShowAllTasksPage(false);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        removeTask,
        showModal,
        setShowModal,
        editingTask,
        setEditingTask,
        openAddModal,
        openEditModal,
        showAllTasksPage,
        openAllTasksPage,
        closeAllTasksPage,
        // filters
        searchTerm,
        setSearchTerm,
        filterDate,
        setFilterDate,
        filterStatus,
        setFilterStatus,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export default TasksProvider;
