import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { boardAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const response = await boardAPI.list();
      setBoards(response.data);
    } catch (error) {
      setError('Failed to fetch boards');
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      const response = await boardAPI.create(formData);
      setBoards([response.data, ...boards]);
      setFormData({ title: '', description: '' });
      setShowCreateForm(false);
    } catch (error) {
      setError('Failed to create board');
      console.error('Error creating board:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <div>Loading boards...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>Your Boards</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showCreateForm ? 'Cancel' : 'Create Board'}
        </button>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          background: '#ffebee', 
          padding: '10px', 
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      {showCreateForm && (
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          marginBottom: '20px',
          borderRadius: '4px',
          border: '1px solid #dee2e6' 
        }}>
          <h3>Create New Board</h3>
          <form onSubmit={handleCreateBoard}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!formData.title.trim()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: formData.title.trim() ? 'pointer' : 'not-allowed',
                opacity: formData.title.trim() ? 1 : 0.6
              }}
            >
              Create Board
            </button>
          </form>
        </div>
      )}

      {boards.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: '#666'
        }}>
          <h3>No boards yet</h3>
          <p>Create your first board to get started!</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {boards.map(board => (
            <div
              key={board.id}
              style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                <Link 
                  to={`/boards/${board.id}`} 
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {board.title}
                </Link>
              </h3>
              {board.description && (
                <p style={{ color: '#666', marginBottom: '15px' }}>
                  {board.description}
                </p>
              )}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '14px',
                color: '#888'
              }}>
                <span>{board.lists_count} lists</span>
                <span>{board.tasks_count} tasks</span>
              </div>
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#aaa' }}>
                Created: {new Date(board.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardList;