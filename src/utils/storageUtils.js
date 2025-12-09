// localStorage utility functions

export const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem('dailyTasks', JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Error saving tasks:', error);
    return false;
  }
};

export const getTasksFromStorage = () => {
  try {
    const tasks = localStorage.getItem('dailyTasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const clearTasksFromStorage = () => {
  try {
    localStorage.removeItem('dailyTasks');
    return true;
  } catch (error) {
    console.error('Error clearing tasks:', error);
    return false;
  }
};

export const saveUserSessionToStorage = (username) => {
  try {
    localStorage.setItem('currentUser', username);
    return true;
  } catch (error) {
    console.error('Error saving session:', error);
    return false;
  }
};

export const getUserSessionFromStorage = () => {
  try {
    return localStorage.getItem('currentUser');
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
};

export const clearUserSessionFromStorage = () => {
  try {
    localStorage.removeItem('currentUser');
    return true;
  } catch (error) {
    console.error('Error clearing session:', error);
    return false;
  }
};

export const exportTasksToJSON = (tasks) => {
  const dataStr = JSON.stringify(tasks, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tasks-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};
