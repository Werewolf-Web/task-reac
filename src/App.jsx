import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TaskManager from './components/TaskManager';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check for existing session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (username) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <div className="app-container">
      {isLoggedIn ? (
        <TaskManager currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

