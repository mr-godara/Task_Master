import { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  Card, 
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import { useAppSelector } from '../hooks/useAppSelector';
import { Todo, Priority } from '../types';
import TaskItem from './TaskItem';

// Filter types
type FilterOption = 'all' | 'active' | 'completed';

// Sort types
type SortOption = 'date-desc' | 'date-asc' | 'priority-high' | 'priority-low';

export default function TaskList() {
  const { todos, isLoading, error } = useAppSelector(state => state.todos);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  // Handle filter change
  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as FilterOption);
  };

  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as SortOption);
  };

  // Filter and sort todos
  const filteredAndSortedTodos = useMemo(() => {
    // First filter
    let result = [...todos];
    
    if (filter === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      result = result.filter(todo => todo.completed);
    }
    
    // Then sort
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'priority-high':
          // Sort high to low (HIGH > MEDIUM > LOW)
          const priorityOrder = { [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'priority-low':
          // Sort low to high (LOW > MEDIUM > HIGH)
          const reversePriorityOrder = { [Priority.HIGH]: 1, [Priority.MEDIUM]: 2, [Priority.LOW]: 3 };
          return reversePriorityOrder[b.priority] - reversePriorityOrder[a.priority];
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [todos, filter, sortBy]);

  // Display message if no todos
  if (todos.length === 0) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="body1" textAlign="center" color="text.secondary" py={4}>
            No tasks yet. Add a new task to get started!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            My Tasks ({filteredAndSortedTodos.length})
          </Typography>
          
          <Box display="flex" gap={2}>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel id="filter-label">Filter</InputLabel>
              <Select
                labelId="filter-label"
                id="filter"
                value={filter}
                label="Filter"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" variant="outlined" sx={{ minWidth: 160 }}>
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                id="sort"
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
                startAdornment={<SortIcon fontSize="small" sx={{ ml: 1, mr: 0.5 }} />}
              >
                <MenuItem value="date-desc">Newest First</MenuItem>
                <MenuItem value="date-asc">Oldest First</MenuItem>
                <MenuItem value="priority-high">Highest Priority</MenuItem>
                <MenuItem value="priority-low">Lowest Priority</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {isLoading && (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={40} />
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {filteredAndSortedTodos.map(todo => (
          <TaskItem key={todo.id} todo={todo} />
        ))}
        
        {filteredAndSortedTodos.length === 0 && !isLoading && (
          <Typography variant="body2" textAlign="center" color="text.secondary" py={3}>
            No {filter === 'all' ? '' : filter} tasks found.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
} 