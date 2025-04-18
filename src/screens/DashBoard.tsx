import { useQuery } from '@apollo/client'
import { GET_ALL_PROJECTS } from '../graphql/Query/queries'

export interface InterfaceProject {
    id: string
    name: string
    goal: string
}

const DashBoard = () => {
    const { data: gqlData, loading, error } = useQuery(GET_ALL_PROJECTS)

    if (loading) return <p>Loading projects...</p>
    if (error) return <p>Error fetching projects: {error.message}</p>

    const projects = gqlData?.getAllProjects ?? []

    return (
        <div>
            <h1>Projects</h1>
            <ul>
                {projects.map((project: InterfaceProject) => (
                    <li key={project.id}>
                        <strong>{project.name}</strong>: {project.goal}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default DashBoard;
