import { gql } from '@apollo/client';

export const HEALTH_CHECK = gql`
    query HealthCheck {
        healthCheck {
            success
            status
            message
        }
    }
`;

export const GET_USER_BY_ID = gql`
    query GetUserById($userId: ID!) {
        getUserById(userId: $userId) {
            id
            email
            username
            role
            createdAt
            updatedAt
            firstName
            lastName
            phone
            gender
            avatar
            social {
                id
                github
                facebook
                twitter
                linkedin
                createdAt
                updatedAt
            }
            userProfile {
                id
                firstName
                lastName
                avatar
                phone
                gender
                createdAt
                updatedAt
            }
            projects {
                id
                key
                name
            }
            sprints {
                id
                title
            }
            teams {
                id
                name
            }
            createdTeams {
                id
                name
            }
            createdTasks {
                id
                title
            }
            assignedTasks {
                id
                title
            }
        }
    }
`;

export const GET_RECENT_PROJECT = gql`
query GetRecentProject {
    getRecentProject {
        id
        key
        name
        description
        createdAt
        updatedAt
        status
        creatorId
        tasks {
            id
            title
            dueDate
            status
        }
        sprints {
            id
            title
            dueDate
            status
            tasks {
                id
                title
                dueDate
            }
        }
    }
}
`;

export const GET_PROJECT_BY_ID = gql`
    query GetProjectById($projectId: ID!) {
        getProjectById(projectId: $projectId) {
            id
            key
            name
            description
            createdAt
            updatedAt
            status
            creatorId
            tasks {
                id
                title
            }
        }
    }
`;

export const GET_TEAM_BY_ID = gql`
    query GetTeamById($teamId: ID!) {
        getTeamById(teamId: $teamId) {
            id
            name
            creatorId
            members {
                id
                email
                username
            }
            projects {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

export const GET_TASK_BY_ID = gql`
    query GetTaskById($taskId: ID!) {
        getTaskById(taskId: $taskId) {
            id
            title
            description
            status
            dueDate
            createdAt
            updatedAt
            projectId
            sprintId
            creator {
                id
                firstName
                lastName
                email
            }
            assignee {
                id
                firstName
                lastName
                username
                email
                avatar
                createdAt
                updatedAt
                role
            }
        }
    }
`;

export const GET_SPRINT_BY_ID = gql`
    query GetSprintById($id: ID!, $projectId: ID!) {
        getSprintById(id: $id, projectId: $projectId) {
            id
            title
            description
            status
            dueDate
            createdAt
            updatedAt
            creator {
                id
                username
            }
            project {
                id
                name
            }
            tasks {
                id
                title
                status
            }
        }
    }
`;

export const GET_ALL_PROJECTS = gql`
    query GetAllProjects {
        getAllProjects {
            id
            key
            name
            description
            createdAt
            updatedAt
            status
            creatorId
        }
    }
`;

export const GET_ALL_TASKS = gql`
    query GetAllTasks($projectId: ID!) {
        getAllTasks(projectId: $projectId) {
            id
            title
            description
            status
            dueDate
            createdAt
            updatedAt
            projectId
            sprintId
            creator {
                id
                firstName
                lastName
                email
            }
            assignee {
                id
                firstName
                lastName
                username
                email
                avatar
                createdAt
                updatedAt
                role
            }
        }
    }
`;

export const GET_ALL_SPRINTS = gql`
    query GetAllSprints($projectId: ID!) {
        getAllSprints(projectId: $projectId) {
            id
            title
            description
            status
            dueDate
            createdAt
            updatedAt
            creator {
                id
                username
            }
            project {
                id
                name
            }
            tasks {
                id
                title
                status
            }
        }
    }
`;

export const GET_ALL_USER_TEAMS = gql`
    query GetAllUserTeams($userId: ID!) {
        getAllUserTeams(userId: $userId) {
            id
            name
            creatorId
            members {
                id
                email
                username
            }
            projects {
                id
                name
            }
            createdAt
            updatedAt
        }
    }
`;

