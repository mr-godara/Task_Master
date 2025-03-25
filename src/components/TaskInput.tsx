import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography,
  Card,
  CardContent,
  SelectChangeEvent
} from '@mui/material';
import { Priority } from '../types';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addTodoWithWeather } from '../features/todosSlice';

export default function TaskInput() {
  const dispatch = useAppDispatch();
  const [taskText, setTaskText] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskText.trim()) {
      setError('Task text cannot be empty');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      await dispatch(addTodoWithWeather({
        text: taskText.trim(),
        priority,
        location: location.trim() || undefined
      })).unwrap();
      
      // Reset form
      setTaskText('');
      setLocation('');
      setPriority(Priority.MEDIUM);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add task');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePriorityChange = (e: SelectChangeEvent) => {
    setPriority(e.target.value as Priority);
  };

  return (
    <Card elevation={3} sx={{ mb: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Add New Task
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="task"
            label="Task"
            name="task"
            autoComplete="off"
            autoFocus
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            error={!!error}
            helperText={error}
            disabled={isSubmitting}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              id="priority"
              value={priority}
              label="Priority"
              onChange={handlePriorityChange}
              disabled={isSubmitting}
            >
              <MenuItem value={Priority.LOW}>Low</MenuItem>
              <MenuItem value={Priority.MEDIUM}>Medium</MenuItem>
              <MenuItem value={Priority.HIGH}>High</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            fullWidth
            id="location"
            label="Location (for weather)"
            name="location"
            autoComplete="off"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isSubmitting}
            helperText="Optional: Enter location to see weather"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 