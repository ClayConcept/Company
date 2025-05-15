import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskGroup, KanbanColumn } from '../types';

interface TaskState {
  taskGroups: TaskGroup[];
  addTaskGroup: (title: string) => void;
  addTask: (groupId: string, title: string, tokens: number) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  moveTaskToColumn: (taskId: string, column: KanbanColumn) => void;
  getTasksByColumn: (column: KanbanColumn) => Task[];
  submitTaskRequest: (taskId: string) => void;
}

const useTaskStore = create<TaskState>((set, get) => ({
  taskGroups: [],
  
  addTaskGroup: (title: string) => {
    const newGroup: TaskGroup = {
      id: uuidv4(),
      title,
      totalTokens: 0,
      tasks: []
    };
    
    set(state => ({
      taskGroups: [...state.taskGroups, newGroup]
    }));
  },
  
  addTask: (groupId: string, title: string, tokens: number) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      tokens,
      parentId: groupId,
      isCompleted: false,
      column: 'request',
      createdAt: new Date().toISOString()
    };
    
    set(state => ({
      taskGroups: state.taskGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            tasks: [...group.tasks, newTask],
            totalTokens: group.totalTokens + tokens
          };
        }
        return group;
      })
    }));
  },
  
  updateTask: (updatedTask: Task) => {
    set(state => {
      const taskGroups = state.taskGroups.map(group => {
        if (group.id === updatedTask.parentId) {
          const oldTask = group.tasks.find(t => t.id === updatedTask.id);
          const tokenDifference = oldTask ? updatedTask.tokens - oldTask.tokens : updatedTask.tokens;
          
          return {
            ...group,
            tasks: group.tasks.map(task => 
              task.id === updatedTask.id ? updatedTask : task
            ),
            totalTokens: group.totalTokens + tokenDifference
          };
        }
        return group;
      });
      
      return { taskGroups };
    });
  },
  
  deleteTask: (taskId: string) => {
    set(state => {
      const taskGroups = state.taskGroups.map(group => {
        const taskToDelete = group.tasks.find(t => t.id === taskId);
        
        if (taskToDelete) {
          return {
            ...group,
            tasks: group.tasks.filter(task => task.id !== taskId),
            totalTokens: group.totalTokens - taskToDelete.tokens
          };
        }
        return group;
      });
      
      return { taskGroups };
    });
  },
  
  moveTaskToColumn: (taskId: string, column: KanbanColumn) => {
    set(state => {
      const newTaskGroups = state.taskGroups.map(group => {
        return {
          ...group,
          tasks: group.tasks.map(task => {
            if (task.id === taskId) {
              const updatedTask = { ...task, column };
              
              // If moving to approved, add approval timestamp
              if (column === 'approved' && !task.approvedAt) {
                updatedTask.approvedAt = new Date().toISOString();
              }
              
              return updatedTask;
            }
            return task;
          })
        };
      });
      
      return { taskGroups: newTaskGroups };
    });
  },
  
  getTasksByColumn: (column: KanbanColumn) => {
    const { taskGroups } = get();
    return taskGroups.flatMap(group => 
      group.tasks.filter(task => task.column === column)
    );
  },
  
  submitTaskRequest: (taskId: string) => {
    // This is a convenience function that moves a task to the request column
    get().moveTaskToColumn(taskId, 'request');
  }
}));

export default useTaskStore;