export interface User {
  id: string;
  email: string;
  username?: string;
  subscription?: SubscriptionTier;
  role: UserRole;
}

export type UserRole = 'user' | 'agent';
export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';

export interface Task {
  id: string;
  title: string;
  tokens: number;
  parentId?: string;
  isCompleted: boolean;
  column: KanbanColumn;
  createdAt: string;
  approvedAt?: string;
  assignedAgentId?: string;
}

export interface TaskGroup {
  id: string;
  title: string;
  totalTokens: number;
  tasks: Task[];
}

export type KanbanColumn = 'request' | 'approved' | 'up-next' | 'in-action' | 'finished';

export type ChatSender = 'user' | 'ai' | 'agent';
export type ChatStatus = 'idle' | 'waiting' | 'connected';

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  content: string;
  timestamp: string;
}

export interface GanttTask {
  id: string;
  title: string;
  tokens: number;
  startDate: string;
  endDate: string;
  progress: number;
  dependencies?: string[];
}