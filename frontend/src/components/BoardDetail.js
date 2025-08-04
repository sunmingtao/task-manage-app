import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { boardAPI, listAPI, taskAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import DragDropProvider from './DragDropProvider';
import DroppableList from './DroppableList';

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [showCreateTask, setShowCreateTask] = useState(null);
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

  const handleMoveTask = async (draggedItem, targetListId, targetIndex) => {
    // Create a copy to avoid mutating the original draggedItem
    const sourceListId = draggedItem.listId;
    const sourceIndex = draggedItem.index;
    const taskId = draggedItem.id;
    
    // If dropped in the same position, do nothing
    if (sourceListId === targetListId && sourceIndex === targetIndex) {
      return;
    }

    console.log('Moving task:', { taskId, sourceListId, sourceIndex, targetListId, targetIndex });

    // Optimistically update the UI
    setBoard(prev => {
      const newLists = [...prev.lists];
      
      // Find source and target lists with safety checks
      const sourceList = newLists.find(list => list.id === sourceListId);
      const targetList = newLists.find(list => list.id === targetListId);
      
      if (!sourceList || !targetList || !sourceList.tasks) {
        console.error('Invalid move operation:', { sourceListId, targetListId, sourceList: !!sourceList, targetList: !!targetList });
        return prev; // Return unchanged state if invalid
      }
      
      // Find the task by ID instead of relying on index
      const taskIndex = sourceList.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        console.error('Task not found in source list:', taskId);
        return prev;
      }
      
      // Remove task from source list
      const [movedTask] = sourceList.tasks.splice(taskIndex, 1);
      
      if (!movedTask) {
        console.error('No task found with ID:', taskId);
        return prev; // Return unchanged state if no task found
      }
      
      // Add task to target list at the correct position
      const safeTargetIndex = Math.max(0, Math.min(targetIndex, targetList.tasks.length));
      targetList.tasks.splice(safeTargetIndex, 0, movedTask);
      
      return {
        ...prev,
        lists: newLists
      };
    });

    try {
      // Update task's list in the backend
      await taskAPI.update(draggedItem.task.id, {
        ...draggedItem.task,
        list: targetListId
      });
    } catch (error) {
      setError('Failed to move task');
      console.error('Error moving task:', error);
      // Optionally revert the UI change here
      fetchBoard(); // Refresh from server
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
    <DragDropProvider>
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
              <DroppableList
                key={list.id}
                list={list}
                onMoveTask={handleMoveTask}
                onDeleteTask={handleDeleteTask}
                onToggleTask={handleToggleTask}
                showCreateTask={showCreateTask}
                setShowCreateTask={setShowCreateTask}
                newTaskData={newTaskData}
                setNewTaskData={setNewTaskData}
                onCreateTask={handleCreateTask}
              />
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
    </DragDropProvider>
  );
};

export default BoardDetail;