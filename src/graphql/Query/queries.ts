import { gql } from '@apollo/client';

export const CHECK_AUTH = gql`
  query {
    checkAuth {
      id
      firstName
      lastName
      createdAt
      email
      username
      profile {
        id
        avatar
        gender
        social {
            linkedin
            facebook
            twitter
        }
      }
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
            profile {
                id
                avatar
                phone
                gender
                social {
                    id
                    github
                    facebook
                    twitter
                    linkedin
                    createdAt
                    updatedAt
                }
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
            createdIssues {
                id
                title
            }
            assignedIssues {
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
            status
            createdAt
            updatedAt
            creatorId
            description
            issues {
                id
                title
                type
                status
                assignee {
                    id
                    email
                    username
                    firstName
                    lastName
                    avatar
                }
                parent {
                    id
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
            issues {
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

export const GET_ISSUE_BY_ID = gql`
    query GetIssueById($issueId: ID!) {
        getIssueById(issueId: $issueId) {
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
                username
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
            issues {
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

export const GET_ALL_ISSUES = gql`
    query GetAllIssues($projectId: ID!) {
        getAllIssues(projectId: $projectId) {
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
                username
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
            issues {
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
