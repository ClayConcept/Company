import { Task } from '../types';

// Calculate tokens per task
export const calculateTokens = (timeInMinutes: number): number => {
  // 1 token = 30 minutes
  const tokens = timeInMinutes / 30;
  return tokens < 1 ? 0 : tokens;
};

// Check if a task is free (less than 1 token)
export const isFreeTask = (task: Task): boolean => {
  return task.tokens < 1;
};

// Calculate total tokens for a list of tasks
export const calculateTotalTokens = (tasks: Task[]): number => {
  return tasks.reduce((total, task) => total + task.tokens, 0);
};

// Calculate time in hours and minutes from tokens
export const calculateTimeFromTokens = (tokens: number): { hours: number; minutes: number } => {
  const totalMinutes = tokens * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return { hours, minutes };
};

// Format time for display
export const formatTime = (tokens: number): string => {
  const { hours, minutes } = calculateTimeFromTokens(tokens);
  
  if (hours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${minutes} min`;
  }
};

// Check if adding task to a day is allowed based on token rules
export const canAddTaskToDay = (
  existingTasks: Task[],
  newTask: Task,
  maxTokensPerDay: number = 2
): boolean => {
  // If it's a big task (more than max tokens per day)
  if (newTask.tokens > maxTokensPerDay) {
    // Can only be added to an empty day
    return existingTasks.length === 0;
  }

  const existingTokens = calculateTotalTokens(existingTasks);
  const freeTasksCount = existingTasks.filter(isFreeTask).length;
  
  // Check if adding this task would exceed the max tokens per day
  if (newTask.tokens + existingTokens > maxTokensPerDay) {
    return false;
  }
  
  // Free task rule: only one free task per day, unless paying 1 token for every 2 additional
  if (isFreeTask(newTask)) {
    return freeTasksCount < 1;
  }
  
  return true;
};