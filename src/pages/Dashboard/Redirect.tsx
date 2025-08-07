import { Navigate } from 'react-router-dom';
import { useDashboard } from './DashBoard';

const ProjectRedirect = () => {
  const { recentProjects, loading, error } = useDashboard();

  if (loading) return <div>Loading...</div>;
  if (error) return <Navigate to="/projects/list" replace />;

  const mostRecentProject = recentProjects[0];

  if (mostRecentProject?.id) {
    return <Navigate to={`/projects/${mostRecentProject.id}`} replace />;
  }
  return <Navigate to="/projects/list" replace />;
};

export default ProjectRedirect;
