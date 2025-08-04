import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import BoardList from './BoardList';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ 
        background: '#343a40',
        color: 'white',
        padding: '10px 20px',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0 }}>Task Manager</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>Welcome, {user?.first_name || user?.username}!</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <BoardList />
    </div>
  );
};

export default Dashboard;