import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Send } from 'lucide-react';
import useTaskStore from '../../store/taskStore';
import useAuthStore from '../../store/authStore';
import { formatTime } from '../../utils/token-calculator';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface NewTaskForm {
  groupId: string;
  title: string;
  tokens: number;
  isOpen: boolean;
}

const TaskCanvas: React.FC = () => {
  const { taskGroups, addTaskGroup, addTask, updateTask, deleteTask, submitTaskRequest } = useTaskStore();
  const { user } = useAuthStore();
  const isAgent = user?.role === 'agent';
  
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newTaskForm, setNewTaskForm] = useState<NewTaskForm>({
    groupId: '',
    title: '',
    tokens: 1,
    isOpen: false,
  });
  const [editingTask, setEditingTask] = useState<{
    id: string;
    title: string;
    tokens: number;
  } | null>(null);
  
  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupTitle.trim()) return;
    
    addTaskGroup(newGroupTitle);
    setNewGroupTitle('');
  };
  
  const openNewTaskForm = (groupId: string) => {
    setNewTaskForm({
      groupId,
      title: '',
      tokens: 1,
      isOpen: true,
    });
  };
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) return;
    
    addTask(newTaskForm.groupId, newTaskForm.title, newTaskForm.tokens);
    setNewTaskForm({
      groupId: '',
      title: '',
      tokens: 1,
      isOpen: false,
    });
  };
  
  const startEditTask = (taskId: string, groupId: string) => {
    if (isAgent) return; // Agents cannot edit tasks
    
    const group = taskGroups.find(g => g.id === groupId);
    const task = group?.tasks.find(t => t.id === taskId);
    
    if (task) {
      setEditingTask({
        id: task.id,
        title: task.title,
        tokens: task.tokens,
      });
    }
  };
  
  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) return;
    
    const group = taskGroups.find(g => 
      g.tasks.some(t => t.id === editingTask.id)
    );
    
    if (group) {
      const task = group.tasks.find(t => t.id === editingTask.id);
      
      if (task) {
        updateTask({
          ...task,
          title: editingTask.title,
          tokens: editingTask.tokens,
        });
      }
    }
    
    setEditingTask(null);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b-2 border-black py-3 px-4">
        <h2 className="text-lg font-bold uppercase">Task Canvas</h2>
        <p className="text-xs">
          {isAgent 
            ? "View and monitor task organization" 
            : "Organize your tasks and estimate tokens"}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {!isAgent && (
          <Card className="mb-6 p-4">
            <h3 className="text-sm font-bold uppercase mb-2">Add New Group</h3>
            <form onSubmit={handleAddGroup} className="flex">
              <input
                type="text"
                value={newGroupTitle}
                onChange={(e) => setNewGroupTitle(e.target.value)}
                placeholder="Group Title"
                className="flex-1 font-mono text-sm border-2 border-black p-2 focus:outline-none"
              />
              <Button
                type="submit"
                className="ml-2"
                disabled={!newGroupTitle.trim()}
              >
                <Plus size={16} />
              </Button>
            </form>
          </Card>
        )}
        
        {taskGroups.map((group) => (
          <Card key={group.id} className="mb-6 overflow-hidden">
            <div className="bg-black text-white p-3">
              <h3 className="text-md font-bold uppercase">{group.title}</h3>
              <div className="text-xs">Total: {formatTime(group.totalTokens)} ({group.totalTokens} tokens)</div>
            </div>
            
            <div className="p-4">
              {group.tasks.length > 0 ? (
                <ul className="space-y-3 mb-4">
                  {group.tasks.map((task) => (
                    <li key={task.id} className="flex items-start border border-black p-2">
                      {editingTask && editingTask.id === task.id ? (
                        <form onSubmit={handleUpdateTask} className="w-full">
                          <input
                            type="text"
                            value={editingTask.title}
                            onChange={(e) => setEditingTask({
                              ...editingTask,
                              title: e.target.value,
                            })}
                            className="w-full font-mono text-sm border border-black p-1 mb-2 focus:outline-none"
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-xs mr-2">Tokens:</span>
                              <input
                                type="number"
                                value={editingTask.tokens}
                                onChange={(e) => setEditingTask({
                                  ...editingTask,
                                  tokens: Number(e.target.value),
                                })}
                                min="0"
                                step="0.5"
                                className="w-16 font-mono text-xs border border-black p-1 focus:outline-none"
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                type="submit"
                                size="sm"
                              >
                                Update
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingTask(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex-1">
                            <div className="text-sm">{task.title}</div>
                            <div className="text-xs mt-1">
                              {task.tokens === 0 
                                ? "Free" 
                                : `${formatTime(task.tokens)} (${task.tokens} ${task.tokens === 1 ? 'token' : 'tokens'})`}
                            </div>
                            {task.column !== 'request' && (
                              <div className="text-xs mt-1 italic">
                                Status: {task.column.replace('-', ' ')}
                              </div>
                            )}
                          </div>
                          {!isAgent && (
                            <div className="flex space-x-1 ml-2">
                              <button
                                onClick={() => startEditTask(task.id, group.id)}
                                className="p-1 text-gray-600 hover:text-black"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-1 text-gray-600 hover:text-red-600"
                              >
                                <Trash2 size={14} />
                              </button>
                              {task.column === 'request' ? null : (
                                <button
                                  onClick={() => submitTaskRequest(task.id)}
                                  className="p-1 text-gray-600 hover:text-blue-600"
                                >
                                  <Send size={14} />
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic mb-4">No tasks yet</p>
              )}
              
              {!isAgent && (
                newTaskForm.isOpen && newTaskForm.groupId === group.id ? (
                  <form onSubmit={handleAddTask} className="mt-2">
                    <input
                      type="text"
                      value={newTaskForm.title}
                      onChange={(e) => setNewTaskForm({
                        ...newTaskForm,
                        title: e.target.value,
                      })}
                      placeholder="Task Title"
                      className="w-full font-mono text-sm border-2 border-black p-2 mb-2 focus:outline-none"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-xs mr-2">Tokens:</span>
                        <input
                          type="number"
                          value={newTaskForm.tokens}
                          onChange={(e) => setNewTaskForm({
                            ...newTaskForm,
                            tokens: Number(e.target.value),
                          })}
                          min="0"
                          step="0.5"
                          className="w-16 font-mono text-xs border border-black p-1 focus:outline-none"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          type="submit"
                          size="sm"
                        >
                          Add
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setNewTaskForm({
                            ...newTaskForm,
                            isOpen: false,
                          })}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <Button
                    onClick={() => openNewTaskForm(group.id)}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <Plus size={14} className="mr-1" /> Add Task
                  </Button>
                )
              )}
            </div>
          </Card>
        ))}
        
        {taskGroups.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No task groups yet</p>
            <p className="text-sm">Start by creating a group or chatting to get AI recommendations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCanvas;