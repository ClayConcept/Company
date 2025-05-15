import React, { useState } from 'react';
import { MoveRight, MoveLeft } from 'lucide-react';
import useTaskStore from '../../store/taskStore';
import useAuthStore from '../../store/authStore';
import { formatTime } from '../../utils/token-calculator';
import Card from '../ui/Card';

const KanbanBoard: React.FC = () => {
  const { getTasksByColumn, moveTaskToColumn } = useTaskStore();
  const { user } = useAuthStore();
  const isAgent = user?.role === 'agent';
  
  const columns: { id: KanbanColumn; label: string }[] = [
    { id: 'request', label: 'Request' },
    { id: 'approved', label: 'Approved' },
    { id: 'up-next', label: 'Up Next' },
    { id: 'in-action', label: 'In Action' },
    { id: 'finished', label: 'Finished' }
  ];
  
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  
  const handleDragStart = (taskId: string) => {
    if (!isAgent) return;
    setDraggedTaskId(taskId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (columnId: KanbanColumn) => {
    if (!isAgent || !draggedTaskId) return;
    
    const task = getTasksByColumn('request').find(t => t.id === draggedTaskId);
    if (task) {
      moveTaskToColumn(draggedTaskId, columnId);
    }
    setDraggedTaskId(null);
  };
  
  const moveToNextColumn = (taskId: string, currentColumnId: KanbanColumn) => {
    if (!isAgent) return;
    
    const currentIndex = columns.findIndex(col => col.id === currentColumnId);
    if (currentIndex < columns.length - 1) {
      moveTaskToColumn(taskId, columns[currentIndex + 1].id);
    }
  };
  
  const moveToPreviousColumn = (taskId: string, currentColumnId: KanbanColumn) => {
    if (!isAgent) return;
    
    const currentIndex = columns.findIndex(col => col.id === currentColumnId);
    if (currentIndex > 0) {
      moveTaskToColumn(taskId, columns[currentIndex - 1].id);
    }
  };
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="border-b-2 border-black py-3 px-4">
        <h2 className="text-lg font-bold uppercase">Kanban Board</h2>
        <p className="text-xs">
          {isAgent 
            ? "Manage and move tasks between columns" 
            : "View task status and progress"}
        </p>
      </div>
      
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex h-full space-x-4 min-w-max">
          {columns.map(column => {
            const tasks = getTasksByColumn(column.id);
            
            return (
              <div 
                key={column.id}
                className="flex flex-col w-64 h-full"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id)}
              >
                <div className="bg-black text-white p-2 text-center font-bold uppercase text-sm">
                  {column.label} ({tasks.length})
                </div>
                
                <div className="flex-1 overflow-y-auto border-l-2 border-r-2 border-black">
                  {tasks.length > 0 ? (
                    <div className="p-2 space-y-2">
                      {tasks.map(task => (
                        <Card
                          key={task.id}
                          className={`p-2 ${isAgent ? 'cursor-grab' : ''}`}
                          draggable={isAgent}
                          onDragStart={() => handleDragStart(task.id)}
                        >
                          <div className="text-sm font-medium">{task.title}</div>
                          <div className="text-xs mt-1">
                            {task.tokens === 0 
                              ? "Free" 
                              : `${formatTime(task.tokens)} (${task.tokens} ${task.tokens === 1 ? 'token' : 'tokens'})`}
                          </div>
                          
                          {isAgent && (
                            <div className="flex justify-between mt-2">
                              {column.id !== 'request' && (
                                <button
                                  onClick={() => moveToPreviousColumn(task.id, column.id)}
                                  className="p-1 text-xs text-gray-600 hover:text-black"
                                >
                                  <MoveLeft size={12} />
                                </button>
                              )}
                              
                              {column.id !== 'finished' && (
                                <button
                                  onClick={() => moveToNextColumn(task.id, column.id)}
                                  className={`p-1 text-xs text-gray-600 hover:text-black ${column.id === 'request' ? 'ml-auto' : ''}`}
                                >
                                  <MoveRight size={12} />
                                </button>
                              )}
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center p-4 text-xs text-gray-500 italic">
                      No tasks
                    </div>
                  )}
                </div>
                
                <div className="bg-black text-white p-1 text-center text-xs">
                  {tasks.reduce((total, task) => total + task.tokens, 0)} tokens
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;