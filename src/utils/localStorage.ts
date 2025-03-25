import { Todo, User } from '../types';

// User storage
export const saveUserToStorage = (user: User | null): void => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const getUserFromStorage = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Todos storage
export const saveTodosToStorage = (todos: Todo[]): void => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

export const getTodosFromStorage = (): Todo[] => {
  const todosStr = localStorage.getItem('todos');
  return todosStr ? JSON.parse(todosStr) : [];
};

// Authentication state
export const saveAuthState = (isAuthenticated: boolean): void => {
  localStorage.setItem('isAuthenticated', String(isAuthenticated));
};

export const getAuthState = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
}; 