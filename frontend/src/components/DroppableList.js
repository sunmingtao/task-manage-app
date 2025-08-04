import React from 'react';
import { useDrop } from 'react-dnd';
import DraggableTask from './DraggableTask';

const ItemTypes = {
  TASK: 'task',
};


const DroppableList = ({ 
  list, 
  onMoveTask,
  onDeleteTask, 
  onToggleTask,
  showCreateTask,
  setShowCreateTask,
  newTaskData,
  setNewTaskData,
  onCreateTask
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item, monitor) => {
      // Only handle drop if moving to a different list
      if (item.listId !== list.id) {
        onMoveTask(item, list.id, list.tasks.length);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop}
      style={{
        minWidth: '300px',
        backgroundColor: isOver ? '#e3f2fd' : '#e9ecef',
        borderRadius: '8px',
        padding: '15px',
        maxHeight: 'calc(100vh - 180px)',
        display: 'flex',
        flexDirection: 'column',
        border: isOver ? '2px dashed #2196f3' : '1px solid transparent',
        transition: 'all 0.2s ease'
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
        marginBottom: '15px',
        minHeight: '100px'
      }}>
        {list.tasks.filter(task => task && task.id).map((task, index) => (
          <DraggableTask
            key={task.id}
            task={task}
            listId={list.id}
            index={index}
            onMoveTask={onMoveTask}
            onDeleteTask={onDeleteTask}
            onToggleTask={onToggleTask}
          />
        ))}
        
        {/* Drop zone indicator when list is empty */}
        {list.tasks.length === 0 && isOver && (
          <div style={{
            border: '2px dashed #2196f3',
            borderRadius: '6px',
            padding: '20px',
            textAlign: 'center',
            color: '#2196f3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)'
          }}>
            Drop task here
          </div>
        )}
      </div>

      {/* Add Task Button/Form */}
      {showCreateTask === list.id ? (
        <form onSubmit={(e) => onCreateTask(e, list.id)}>
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
  );
};

export default DroppableList;