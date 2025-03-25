import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Todo, Priority, TodoState, WeatherData } from '../types';
import { saveTodosToStorage, getTodosFromStorage } from '../utils/localStorage';
import { getWeatherByLocation, getMockWeather } from '../services/weatherApi';

const initialState: TodoState = {
  todos: getTodosFromStorage(),
  isLoading: false,
  error: null,
};

// Async thunk for adding a new todo with weather data
export const addTodoWithWeather = createAsyncThunk(
  'todos/addTodoWithWeather',
  async (todoData: { text: string; priority: Priority; location?: string }) => {
    try {
      let weatherData: WeatherData | null = null;
      
      // If location is provided, fetch weather data
      if (todoData.location) {
        try {
          weatherData = await getWeatherByLocation(todoData.location);
        } catch (error) {
          // Fallback to mock weather if API fails
          weatherData = getMockWeather(todoData.location);
        }
      }
      
      const newTodo: Todo = {
        id: uuidv4(),
        text: todoData.text,
        completed: false,
        priority: todoData.priority,
        createdAt: new Date().toISOString(),
        location: todoData.location,
        weather: weatherData || undefined,
      };
      
      return newTodo;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create todo');
    }
  }
);

// Update weather data for a specific todo
export const updateTodoWeather = createAsyncThunk(
  'todos/updateTodoWeather',
  async (todo: Todo) => {
    try {
      if (!todo.location) return todo;
      
      const weatherData = await getWeatherByLocation(todo.location)
        .catch(() => getMockWeather(todo.location!));
      
      return { ...todo, weather: weatherData };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update weather');
    }
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodosToStorage(state.todos);
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      saveTodosToStorage(state.todos);
    },
    updateTodoPriority: (state, action: PayloadAction<{ id: string; priority: Priority }>) => {
      const todo = state.todos.find(todo => todo.id === action.payload.id);
      if (todo) {
        todo.priority = action.payload.priority;
        saveTodosToStorage(state.todos);
      }
    },
    clearTodos: (state) => {
      state.todos = [];
      saveTodosToStorage(state.todos);
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Todo with Weather
      .addCase(addTodoWithWeather.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTodoWithWeather.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.isLoading = false;
        state.todos.push(action.payload);
        saveTodosToStorage(state.todos);
      })
      .addCase(addTodoWithWeather.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add todo';
      })
      // Update Todo Weather
      .addCase(updateTodoWeather.fulfilled, (state, action: PayloadAction<Todo>) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
          saveTodosToStorage(state.todos);
        }
      });
  },
});

export const { toggleTodo, deleteTodo, updateTodoPriority, clearTodos } = todosSlice.actions;
export default todosSlice.reducer; 