import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import todosReducer from '../features/todosSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todosReducer,
  },
  // Enable Redux DevTools extension
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 