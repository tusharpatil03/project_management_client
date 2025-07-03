import { JSX } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const ProjectRoutes = (): JSX.Element => {
    const project = localStorage.getItem('projectId');

    const navigate = useNavigate();

    return project ? <Outlet /> : <>{navigate('/project/create')}</>;
};

export default ProjectRoutes;
