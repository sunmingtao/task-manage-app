import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { boardAPI, listAPI, taskAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [showCreateTask, setShowCreateTask] = useState(null); // listId when showing task form
  const [newTaskData, setNewTaskData] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const fetchBoard = async () => {
    try {
      setLoading(true);
      const response = await boardAPI.get(id);
      setBoard(response.data);
    } catch (error) {
      setError('Failed to fetch board');
      console.error('Error fetching board:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    try {
      const response = await listAPI.create({
        title: newListTitle,
        board: parseInt(id)
      });
      
      // Add new list to board
      setBoard(prev => ({
        ...prev,
        lists: [...prev.lists, { ...response.data, tasks: [] }],
        lists_count: prev.lists_count + 1
      }));
      
      setNewListTitle('');
      setShowCreateList(false);
    } catch (error) {
      setError('Failed to create list');
      console.error('Error creating list:', error);
    }
  };

  const handleCreateTask = async (e, listId) => {
    e.preventDefault();
    if (!newTaskData.title.trim()) return;

    try {
      const response = await taskAPI.create({
        title: newTaskData.title,
        description: newTaskData.description,
        list: listId
      });
      
      // Add new task to the appropriate list
      setBoard(prev => ({
        ...prev,
        lists: prev.lists.map(list => 
          list.id === listId 
            ? { ...list, tasks: [...list.tasks, response.data], tasks_count: list.tasks_count + 1 }
            : list
        ),
        tasks_count: prev.tasks_count + 1
      }));
      
      setNewTaskData({ title: '', description: '' });
      setShowCreateTask(null);
    } catch (error) {
      setError('Failed to create task');
      console.error('Error creating task:', error);
    }
  };

  const handleDeleteTask = async (taskId, listId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskAPI.delete(taskId);
      
      // Remove task from the appropriate list
      setBoard(prev => ({
        ...prev,
        lists: prev.lists.map(list => 
          list.id === listId 
            ? { 
                ...list, 
                tasks: list.tasks.filter(task => task.id !== taskId),
                tasks_count: list.tasks_count - 1
              }
            : list
        ),
        tasks_count: prev.tasks_count - 1
      }));
    } catch (error) {
      setError('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleTask = async (task, listId) => {
    try {
      const response = await taskAPI.update(task.id, {
        ...task,
        completed: !task.completed
      });
      
      // Update task in the appropriate list
      setBoard(prev => ({
        ...prev,
        lists: prev.lists.map(list => 
          list.id === listId 
            ? { 
                ...list, 
                tasks: list.tasks.map(t => t.id === task.id ? response.data : t)
              }
            : list
        )
      }));
    } catch (error) {
      setError('Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        Loading board...
      </div>
    );
  }

  if (!board) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Board not found</h2>
        <button onClick={() => navigate('/dashboard')} 
                style={{ padding: '10px 20px', marginTop: '10px' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ 
        background: '#343a40',
        color: 'white',
        padding: '15px 20px',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'transparent',
              border: '1px solid #6c757d',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
          <div>
            <h2 style={{ margin: 0 }}>{board.title}</h2>
            {board.description && (
              <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '14px' }}>
                {board.description}
              </p>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', opacity: 0.8 }}>
            {board.lists_count} lists • {board.tasks_count} tasks
          </span>
        </div>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          background: '#ffebee', 
          padding: '10px 20px', 
          borderBottom: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      )}

      {/* Board Content */}
      <div style={{ 
        flex: 1, 
        padding: '20px', 
        overflowX: 'auto',
        background: '#f8f9fa'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          minHeight: '100%',
          alignItems: 'flex-start'
        }}>
          {/* Lists */}
          {board.lists.map(list => (
            <div 
              key={list.id}
              style={{
                minWidth: '300px',
                backgroundColor: '#e9ecef',
                borderRadius: '8px',
                padding: '15px',
                maxHeight: 'calc(100vh - 180px)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* List Header */}
              <div style={{ 
                marginBottom: '15px',
                paddingBottom: '10px',
                borderBottom: '1px solid #dee2e6'
              }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#495057' }}>
                  {list.title}
                </h3>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                  {list.tasks.length} tasks
                </div>
              </div>

              {/* Tasks */}
              <div style={{ 
                flex: 1, 
                overflowY: 'auto',
                marginBottom: '15px'
              }}>
                {list.tasks.map(task => (
                  <div 
                    key={task.id}
                    style={{
                      backgroundColor: 'white',
                      padding: '12px',
                      marginBottom: '10px',
                      borderRadius: '6px',
                      border: '1px solid #dee2e6',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <h4 style={{ 
                        margin: 0, 
                        fontSize: '14px',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? '#6c757d' : '#333'
                      }}>
                        {task.title}
                      </h4>
                      <button
                        onClick={() => handleDeleteTask(task.id, list.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#dc3545',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    {task.description && (
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '12px', 
                        color: '#6c757d' 
                      }}>
                        {task.description}
                      </p>
                    )}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task, list.id)}
                          style={{ marginRight: '5px' }}
                        />
                        {task.completed ? 'Completed' : 'Mark complete'}
                      </label>
                      {task.priority !== 'medium' && (
                        <span style={{ 
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          backgroundColor: task.priority === 'high' ? '#dc3545' : '#28a745',
                          color: 'white'
                        }}>
                          {task.priority}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Task Button/Form */}
              {showCreateTask === list.id ? (
                <form onSubmit={(e) => handleCreateTask(e, list.id)}>
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTaskData.title}
                    onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px',
                      marginBottom: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    autoFocus
                  />
                  <textarea
                    placeholder="Description (optional)"
                    value={newTaskData.description}
                    onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})}
                    rows="2"
                    style={{
                      width: '100%',
                      padding: '8px',
                      marginBottom: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="submit"
                      disabled={!newTaskData.title.trim()}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: newTaskData.title.trim() ? 'pointer' : 'not-allowed',
                        opacity: newTaskData.title.trim() ? 1 : 0.6
                      }}
                    >
                      Add Task
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateTask(null);
                        setNewTaskData({ title: '', description: '' });
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowCreateTask(list.id)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'rgba(0,123,255,0.1)',
                    border: '1px dashed #007bff',
                    borderRadius: '4px',
                    color: '#007bff',
                    cursor: 'pointer'
                  }}
                >
                  + Add a task
                </button>
              )}
            </div>
          ))}

          {/* Add List Button/Form */}
          {showCreateList ? (
            <div style={{
              minWidth: '300px',
              backgroundColor: '#e9ecef',
              borderRadius: '8px',
              padding: '15px'
            }}>
              <form onSubmit={handleCreateList}>
                <input
                  type="text"
                  placeholder="Enter list title"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="submit"
                    disabled={!newListTitle.trim()}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: newListTitle.trim() ? 'pointer' : 'not-allowed',
                      opacity: newListTitle.trim() ? 1 : 0.6
                    }}
                  >
                    Add List
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateList(false);
                      setNewListTitle('');
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateList(true)}
              style={{
                minWidth: '300px',
                height: '50px',
                backgroundColor: 'rgba(108,117,125,0.1)',
                border: '1px dashed #6c757d',
                borderRadius: '8px',
                color: '#6c757d',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              + Add a list
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;