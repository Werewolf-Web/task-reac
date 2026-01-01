import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import AppNavbar from './components/AppNavbar';
import ManageTasksPage from './components/ManageTasksPage';
import AddTaskPage from './components/AddTaskPage';
import AllTasksPage from './components/AllTasksPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('manage'); // manage, add, all

  // Check for existing session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoggedIn]);

  const handleLogin = (username) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', username);
    setCurrentPage('manage');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
    setCurrentPage('manage');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'add':
        return <AddTaskPage />;
      case 'all':
        return <AllTasksPage />;
      case 'manage':
      default:
        return <ManageTasksPage currentUser={currentUser} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="app-container">
      {isLoggedIn ? (
        <>
          <AppNavbar 
            currentPage={currentPage} 
            onNavigate={setCurrentPage}
            onLogout={handleLogout} 
          />
          {renderPage()}
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

