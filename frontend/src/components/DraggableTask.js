import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
  TASK: 'task',
};

const DraggableTask = ({ 
  task, 
  listId, 
  index,
  onMoveTask, 
  onDeleteTask, 
  onToggleTask,
  onEditTask
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { 
      id: task.id, 
      listId, 
      index,
      task
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Remove the drop functionality from individual tasks
  // Let the DroppableList handle all drop operations

  // Only use drag ref since we removed drop from individual tasks
  const attachRef = (el) => {
    drag(el);
  };

  return (
    <div 
      ref={attachRef}
      style={{
        backgroundColor: 'white',
        padding: '12px',
        marginBottom: '10px',
        borderRadius: '6px',
        border: '1px solid #dee2e6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(5deg)' : 'none',
        transition: 'transform 0.2s ease'
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
          color: task.completed ? '#6c757d' : '#333',
          flex: 1,
          marginRight: '8px'
        }}>
          {task.title}
        </h4>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditTask(task);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '2px 4px',
              borderRadius: '3px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask(task.id, listId);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#dc3545',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '2px 4px',
              borderRadius: '3px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            title="Delete task"
          >
            ×
          </button>
        </div>
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
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}>
        <span style={{ 
          fontSize: '10px',
          padding: '2px 6px',
          borderRadius: '10px',
          backgroundColor: task.priority === 'high' ? '#dc3545' : 
                          task.priority === 'medium' ? '#ffc107' : '#28a745',
          color: task.priority === 'medium' ? '#000' : 'white'
        }}>
          {task.priority}
        </span>
      </div>
    </div>
  );
};

export default DraggableTask;