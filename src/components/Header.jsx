import React from 'react';
import { useAuth } from '../context/AuthContext';
// import toast from '../utils/toast';

const Header = ({ user, searchTerm, onSearchChange, onCreateNote }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    //   toast.info('You have been logged out successfully');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1>Notes App</h1>
          <span className="welcome-text">Welcome, {user?.username}!</span>
        </div>
        
        <div className="header-center">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="header-right">
          <button onClick={onCreateNote} className="create-btn">
            + New Note
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
