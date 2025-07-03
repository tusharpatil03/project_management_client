import { gql } from '@apollo/client';

export const CREATE_PROJECT = gql`
    mutation CreateProject($input: CreateProjectInput!) {
        createProject(input: $input) {
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

export const CREATE_TEAM = gql`
    mutation CreateTeam($input: CreateTeamInput!) {
        createTeam(input: $input) {
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

export const CREATE_TASK = gql`
    mutation CreateTask($input: CreateTaskInput!) {
        createTask(input: $input) {
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
                username
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

export const CREATE_SPRINT = gql`
    mutation CreateSprint($input: CreateSprintInput!) {
        createSprint(input: $input) {
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

export const UPDATE_ISSUE_STATUS = gql`
    mutation changeStatus(
        $updateIssueStatusProjectId2: ID!
        $updateIssueStatusIssueId2: ID!
        $status: IssueStatus!
    ) {
        updateIssueStatus(
            projectId: $updateIssueStatusProjectId2
            issueId: $updateIssueStatusIssueId2
            status: $status
        ) {
            message
            status
            success
        }
    }
`;

export const ASSIGN_ISSUE = gql`
    mutation AssineIssue($input: AssignTaskInput!) {
        assineTask(input: $input) {
            success
            status
            message
        }
    }
`;

export const SIGNUP_USER = gql`
    mutation Signup($input: SignupInput!) {
        signup(input: $input) {
            user {
                id
                email
                username
                firstName
                lastName
            }
            profile {
                id
                avatar
                gender
            }
            accessToken
            refreshToken
        }
    }
`;

export const LOGIN_USER = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
           user {
                id
                email
                username
                firstName
                lastName
            }
            profile {
                id
                avatar
                gender
            }
            accessToken
            refreshToken
        }
    }
`;

export const REMOVE_PROJECT = gql`
    mutation RemoveProject($projectId: ID!) {
        removeProject(projectId: $projectId) {
            success
            status
            message
        }
    }
`;

export const REMOVE_ISSUE = gql`
    mutation RemoveIssue($taskId: ID!, $projectId: ID!) {
        removeTask(taskId: $taskId, projectId: $projectId) {
            success
            status
            message
        }
    }
`;

export const REMOVE_SPRINT = gql`
    mutation RemoveSprint($sprintId: ID!, $projectId: ID!) {
        removeSprint(sprintId: $sprintId, projectId: $projectId) {
            success
            status
            message
        }
    }
`;

export const REMOVE_ASSIGNEE_OF_ISSUE = gql`
    mutation RemoveAssineeOfIssue($taskId: ID!) {
        removeAssineeOfTask(taskId: $taskId) {
            id
            title
            assignee {
                id
                username
            }
        }
    }
`;

export const REMOVE_TEAM = gql`
    mutation RemoveTeam($teamId: ID!) {
        removeTeam(teamId: $teamId) {
            success
            status
            message
        }
    }
`;

export const ADD_TEAM_MEMBER = gql`
    mutation AddTeamMember($memberId: ID!, $teamId: ID!, $role: String!) {
        addTeamMember(memberId: $memberId, teamId: $teamId, role: $role) {
            id
            name
            members {
                id
                username
                email
            }
        }
    }
`;

export const LOGOUT = gql`
    mutation Logout {
        logout
    }
`;

export const REMOVE_TEAM_MEMBER = gql`
    mutation RemoveTeamMember($memberId: ID!, $teamId: ID!) {
        removeTeamMember(memberId: $memberId, teamId: $teamId) {
            id
            name
            members {
                id
                username
                email
            }
        }
    }
`;

export const REFRESH_TOKEN = gql`
    mutation RefreshToken($refreshToken: String) {
        refreshToken(refreshToken: $refreshToken) {
            accessToken
            refreshToken
        }
    }
`;
