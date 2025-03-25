# TaskMaster - Todo Application

This is a modern Todo application built with React, TypeScript, and Redux. It includes features like task prioritization, weather integration, user authentication, and responsive design.

## Features

- **User Authentication**: Simple login/logout with mock authentication
- **Task Management**: Add, view, complete, and delete tasks
- **Task Prioritization**: Set priorities (High, Medium, Low) for tasks
- **Weather Integration**: View weather information for location-based tasks
- **Responsive Design**: Mobile-first approach with support for all device sizes
- **Data Persistence**: Uses local storage to save tasks and authentication state
- **Advanced State Management**: Redux with Redux Toolkit for state management
- **Async Operations**: Redux Thunk for handling asynchronous actions
- **Modern UI**: Material-UI components for a clean and modern interface

## Technologies Used

- React.js with TypeScript
- Redux (Redux Toolkit)
- Material-UI
- Local Storage API
- OpenWeatherMap API integration
- CSS Grid and Flexbox

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd taskmaster
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_WEATHER_API_KEY=your_openweathermap_api_key
   VITE_WEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5
   ```
   If you don't have an OpenWeatherMap API key, the app will use mock weather data.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## Usage

1. **Authentication**: Any username and password (minimum 4 characters) will work for the demo
2. **Adding Tasks**: Enter task details, set priority, and optionally enter a location
3. **Managing Tasks**: Check tasks to mark as complete, delete tasks, or change priorities
4. **Viewing Weather**: If a location is provided, weather information will be displayed
5. **Filtering & Sorting**: Use filter and sort options to organize your tasks

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable UI components
├── features/       # Redux slices
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API services
├── store/          # Redux store configuration
├── types/          # TypeScript types
├── utils/          # Utility functions
├── App.tsx         # Main application component
└── main.tsx        # Application entry point
```



