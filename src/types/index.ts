export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  location?: string;
  weather?: WeatherData;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
}

export interface User {
  id: string;
  username: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
  todos: TodoState;
} 