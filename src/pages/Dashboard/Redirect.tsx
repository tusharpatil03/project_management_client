import { Navigate } from 'react-router-dom';
import { useDashboard } from './DashBoard';

const ProjectRedirect = () => {
  const { currentProject, loading, error } = useDashboard();

  if (loading) return <div>Loading...</div>;
  if (error) return <Navigate to="/projects/list" replace />;

  if (currentProject?.id) {
    //console.log("user:", user);
    return <Navigate to={`/projects/${currentProject.id}`} replace />;
  }
  return <Navigate to="/projects/list" replace />;
};

export default ProjectRedirect;
