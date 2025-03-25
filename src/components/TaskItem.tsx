import { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Card, 
  CardContent, 
  CardActions, 
  Checkbox, 
  Chip, 
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { Todo, Priority } from '../types';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { toggleTodo, deleteTodo, updateTodoPriority, updateTodoWeather } from '../features/todosSlice';
import { formatDateFromIso } from '../utils/formatDate';

interface TaskItemProps {
  todo: Todo;
}

export default function TaskItem({ todo }: TaskItemProps) {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  // Get color based on priority
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return 'error';
      case Priority.MEDIUM:
        return 'warning';
      case Priority.LOW:
        return 'success';
      default:
        return 'default';
    }
  };
  
  // Handle menu open
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle priority change
  const handlePriorityChange = (priority: Priority) => {
    dispatch(updateTodoPriority({ id: todo.id, priority }));
    handleMenuClose();
  };
  
  // Handle refresh weather
  const handleRefreshWeather = () => {
    if (todo.location) {
      dispatch(updateTodoWeather(todo));
    }
    handleMenuClose();
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        borderRadius: 2,
        opacity: todo.completed ? 0.7 : 1,
        transition: 'all 0.3s ease',
        borderLeft: `6px solid ${
          todo.priority === Priority.HIGH ? '#f44336' : 
          todo.priority === Priority.MEDIUM ? '#ff9800' : 
          '#4caf50'
        }`,
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box display="flex" alignItems="flex-start">
          <Checkbox 
            checked={todo.completed}
            onChange={() => dispatch(toggleTodo(todo.id))}
            color="primary"
            sx={{ mt: -0.5, mr: 1 }}
          />
          
          <Box flexGrow={1}>
            <Typography 
              variant="body1" 
              component="div" 
              sx={{ 
                textDecoration: todo.completed ? 'line-through' : 'none',
                wordBreak: 'break-word',
              }}
            >
              {todo.text}
            </Typography>

            <Box display="flex" alignItems="center" mt={1} flexWrap="wrap" gap={1}>
              <Chip 
                size="small" 
                label={todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} 
                color={getPriorityColor(todo.priority) as any}
                icon={<FlagIcon fontSize="small" />}
              />
              
              {todo.location && (
                <Chip 
                  size="small" 
                  label={todo.location}
                  variant="outlined"
                />
              )}
              
              <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                {formatDateFromIso(todo.createdAt)}
              </Typography>
            </Box>
            
            {/* Weather information */}
            {todo.weather && (
              <Box mt={1} sx={{ display: 'flex', alignItems: 'center' }}>
                <WbSunnyIcon fontSize="small" color="warning" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {todo.weather.condition}, {todo.weather.temperature}°C
                </Typography>
                {todo.weather.icon && (
                  <Box component="img" src={todo.weather.icon} alt={todo.weather.condition} sx={{ height: 30, ml: 1 }} />
                )}
              </Box>
            )}
          </Box>
          
          <IconButton 
            aria-label="more"
            aria-controls="task-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
            size="small"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          
          <Menu
            id="task-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: { minWidth: 180 }
            }}
          >
            <MenuItem onClick={() => handlePriorityChange(Priority.HIGH)}>
              <ListItemIcon>
                <FlagIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>High Priority</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handlePriorityChange(Priority.MEDIUM)}>
              <ListItemIcon>
                <FlagIcon fontSize="small" color="warning" />
              </ListItemIcon>
              <ListItemText>Medium Priority</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handlePriorityChange(Priority.LOW)}>
              <ListItemIcon>
                <FlagIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Low Priority</ListItemText>
            </MenuItem>
            
            {todo.location && (
              <MenuItem onClick={handleRefreshWeather}>
                <ListItemIcon>
                  <WbSunnyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Refresh Weather</ListItemText>
              </MenuItem>
            )}
          </Menu>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <IconButton 
          aria-label="delete" 
          onClick={() => dispatch(deleteTodo(todo.id))}
          size="small"
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
} 