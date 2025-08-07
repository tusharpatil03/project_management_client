import { Outlet } from 'react-router-dom';
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from 'react';
import { useQuery } from '@apollo/client';
import { GET_RECENT_PROJECT } from '../../graphql/Query/project';
import { InterfaceProject } from '../../types/types';
import DashboardLayout from './DashBoardLayout';

// Types
interface DashboardState {
  recentProjects: InterfaceProject[];
  currentProject: InterfaceProject | null;
  loading: boolean;
  error: any;
}

interface DashboardContextType extends DashboardState {
  refetch: () => void;
  updateProject: (projectData: InterfaceProject) => void;
  setCurrentProject: (project: InterfaceProject) => void;
}

// Initial state
const initialState: DashboardState = {
  recentProjects: [],
  currentProject: null,
  loading: true,
  error: null,
};

// Action types
type DashboardAction =
  | { type: 'SET_RECENT_PROJECTS'; payload: InterfaceProject[] }
  | { type: 'SET_CURRENT_PROJECT'; payload: InterfaceProject }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: any }
  | { type: 'UPDATE_PROJECT'; payload: InterfaceProject };

// Reducer
const dashboardReducer = (
  state: DashboardState,
  action: DashboardAction
): DashboardState => {
  switch (action.type) {
    case 'SET_RECENT_PROJECTS':
      return { ...state, recentProjects: action.payload };

    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        recentProjects: state.recentProjects.map((project) =>
          project.id === action.payload.id
            ? { ...project, ...action.payload }
            : project
        ),

        currentProject:
          state.currentProject?.id === action.payload.id
            ? { ...state.currentProject, ...action.payload }
            : state.currentProject,
      };

    default:
      return state;
  }
};

// Create context
const DashboardContext = createContext<DashboardContextType | null>(null);

// Provider component
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const { data, loading, error, refetch } = useQuery(GET_RECENT_PROJECT, {
    errorPolicy: 'all',
  });

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: loading });

    if (error) {
      dispatch({ type: 'SET_ERROR', payload: error });
    }

    if (data) {
      dispatch({
        type: 'SET_RECENT_PROJECTS',
        payload: [{ ...data.recentProject }],
      });
      dispatch({ type: 'SET_ERROR', payload: null });
    }
  }, [data, loading, error]);

  // Action creators
  const updateProject = (projectData: InterfaceProject) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: projectData });
  };

  const setCurrentProject = (project: InterfaceProject) => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
  };

  const value: DashboardContextType = {
    ...state,
    refetch,
    updateProject,
    setCurrentProject,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook to use dashboard context
export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }

  return context;
};

// Dashboard component
const Dashboard = () => {


  return (
    <DashboardProvider>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </DashboardProvider>
  );
};

export default Dashboard;
