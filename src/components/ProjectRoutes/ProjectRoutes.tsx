import { JSX, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { GET_RECENT_PROJECT } from '../../graphql/Query/project';
import { useQuery } from '@apollo/client';

const ProjectRoutes = (): JSX.Element => {
  const { data, loading, error } = useQuery(GET_RECENT_PROJECT);

  useEffect(() => {
    if (data?.getRecentProject) {
      localStorage.setItem('project', JSON.stringify(data.getRecentProject));
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <span>Error: {error.message}</span>
      </div>
    );
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default ProjectRoutes;
