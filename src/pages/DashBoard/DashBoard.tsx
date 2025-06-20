import { useQuery } from '@apollo/client';
import { GET_ALL_PROJECTS } from '../../graphql/Query/queries';
import Navigate from './Navigate';
import { useEffect, useState } from 'react';
import ProjectTable from '../../components/Project/AllProjects';

export interface InterfaceProject {
    id: string;
    name: string;
    description: string;
    team?: string;
    dueDate?: string;
    createdAt: string;
    goal: string;
    updatedAt: string;
}

const DashBoard = (): React.ReactElement => {
    const { data: gqlData, loading, error } = useQuery(GET_ALL_PROJECTS);
    const [recentProject, setRecentProject] = useState<InterfaceProject | null>(
        null
    );

    useEffect(() => {
        if (!gqlData?.getAllProjects) return;

        const projects: InterfaceProject[] = gqlData.getAllProjects;
        if (projects.length === 0) return;

        const mostRecent = projects.reduce((latest, current) =>
            new Date(current.updatedAt) > new Date(latest.updatedAt)
                ? current
                : latest
        );

        setRecentProject(mostRecent);
    }, [gqlData]);

    const date = new Date('2025-04-25');
    console.log('Date:', date);

    if (loading) return <p>Loading projects...</p>;
    if (error) return <p>Error fetching projects: {error.message}</p>;

    return (
        <div>
            <Navigate />
            <div className="p-4 sm:ml-64 mt-14 rounded-lg">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <p>Projects</p>
                    <h2>
                        {recentProject ? (
                            <ProjectTable projects={[recentProject]} />
                        ) : (
                            'No recent project'
                        )}
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;

export const DateComponent = () => {
    const input = '25-04-2025';
    const [day, month, year] = input.split('-');
    const date = new Date(`${year}-${month}-${day}`);

    // format for UI display
    const formatted = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    return <p>Selected Date: {formatted}</p>;
};
