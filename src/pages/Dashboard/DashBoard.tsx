import { Outlet } from 'react-router-dom';
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useQuery } from '@apollo/client';
import { InterfaceProject, InterfaceUser } from '../../types/';
import DashboardLayout from './DashBoardLayout';
import { GET_USER_INFO } from '../../graphql/Query/user';

// Types
interface DashboardState {
  recentProjects: InterfaceProject[];
  projects: InterfaceProject[];
  starredProjects: InterfaceProject[];
  currentProject: InterfaceProject | null;
  user: InterfaceUser | null;
  loading: boolean;
  error: any;
}

interface DashboardContextType extends DashboardState {
  refetch: () => void;
  updateProject: (projectData: InterfaceProject) => void;
  setCurrentProject: (project: InterfaceProject) => void;
  setStarredProject: (projects: InterfaceProject[]) => void;
  setUser: (user: InterfaceUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: any) => void;
  setRecentProjects: (projects: InterfaceProject[]) => void;
}

// Initial state
const initialState: DashboardState = {
  recentProjects: [],
  projects: [],
  starredProjects: [],
  currentProject: null,
  user: null,
  loading: true,
  error: null,
};

// Action types
type DashboardAction =
  | { type: 'BATCH_UPDATE'; payload: DashboardState }
  | { type: 'SET_RECENT_PROJECTS'; payload: InterfaceProject[] }
  | { type: 'SET_PROJECTS'; payload: InterfaceProject[] }
  | { type: 'SET_CURRENT_PROJECT'; payload: InterfaceProject }
  | { type: 'SET_STARRED_PROJECTS'; payload: InterfaceProject[] }
  | { type: 'SET_USER'; payload: InterfaceUser | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: any }
  | { type: 'UPDATE_PROJECT'; payload: InterfaceProject };

// Reducer
const dashboardReducer = (
  state: DashboardState,
  action: DashboardAction
): DashboardState => {
  switch (action.type) {
    case 'BATCH_UPDATE':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_RECENT_PROJECTS':
      return { ...state, recentProjects: action.payload };

    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };

    case 'SET_STARRED_PROJECTS':
      return { ...state, starredProjects: action.payload };

    case 'SET_USER':
      return { ...state, user: action.payload };

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

        projects: state.projects.map((project) =>
          project.id === action.payload.id
            ? { ...project, ...action.payload }
            : project
        ),
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
  const isInitialLoad = useRef(true);

  const { data, loading, error, refetch } = useQuery<{
    getUserInfo: InterfaceUser;
  }>(GET_USER_INFO, {
    errorPolicy: 'all',
  });

  // Memoize action creators to prevent re-creation on every render
  const updateProject = useCallback((projectData: InterfaceProject) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: projectData });
  }, []);

  const setCurrentProject = useCallback((project: InterfaceProject) => {
    dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
  }, []);

  const setStarredProject = useCallback((projects: InterfaceProject[]) => {
    dispatch({ type: 'SET_STARRED_PROJECTS', payload: projects });
  }, []);

  const setRecentProjects = useCallback((projects: InterfaceProject[]) => {
    dispatch({ type: 'SET_RECENT_PROJECTS', payload: projects });
  }, []);

  const setUser = useCallback((user: InterfaceUser | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: any) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  // Batch multiple dispatches to reduce re-renders
  useEffect(() => {
    if (loading !== state.loading) {
      dispatch({ type: 'SET_LOADING', payload: loading });
    }

    if (error && error !== state.error) {
      dispatch({ type: 'SET_ERROR', payload: error });
      return; // Don't process data if there's an error
    }

    if (data && data.getUserInfo) {
      // Batch all data-related dispatches
      const userInfo = data.getUserInfo;
      const projects = userInfo.projects || [];

      const recentProjects = projects
        .filter((project:InterfaceProject) => project.updatedAt)
        .sort(
          (a:InterfaceProject, b:InterfaceProject) =>
            Number(new Date(b.updatedAt)) - Number(new Date(a.updatedAt))
        )
        .slice(0, 4);


      const starredProjects = projects.filter((project:InterfaceProject) => project.starred);
      const currentProject = recentProjects[0] || projects[0] || null;

      // Use a batch dispatch to update multiple values at once
      dispatch({
        type: 'BATCH_UPDATE',
        payload: {
          user: userInfo,
          projects,
          recentProjects,
          starredProjects,
          currentProject,
          loading: false,
          error: null,
        },
      });

      isInitialLoad.current = false;
    }
  }, [data, loading, error]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      ...state,
      refetch,
      updateProject,
      setCurrentProject,
      setRecentProjects,
      setStarredProject,
      setUser,
      setLoading,
      setError,
    }),
    [
      state,
      refetch,
      updateProject,
      setCurrentProject,
      setRecentProjects,
      setStarredProject,
      setUser,
      setLoading,
      setError,
    ]
  );

  return (
    <DashboardContext.Provider value={contextValue}>
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
