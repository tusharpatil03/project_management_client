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

export const CREATE_ISSUE = gql`
  mutation CreateIssue($input: CreateIssueInput!) {
    createIssue(input: $input) {
      id
      title
      description
      status
      dueDate
      createdAt
      updatedAt
      projectId
      sprintId
      assignee {
        id
        firstName
        lastName
        username
        email
        avatar
        createdAt
        updatedAt
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

export const GET_ACTIVE_SPRINT = gql`
  query GetActiveSprint($getActiveSprintProjectId2: ID!) {
    getActiveSprint(projectId: $getActiveSprintProjectId2) {
      id
      title
      status
      dueDate
      issues {
        id
        title
        status
        type
        dueDate
        assignee {
          id
          email
          firstName
          lastName
          avatar
        }
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
  mutation AssineIssue($input: AssignIssueInput!) {
    assineIssue(input: $input) {
      success
      status
      message
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      message
      status
      success
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
        isVerified
      }
      profile {
        avatar
      }
      accessToken
      refreshToken
    }
  }
`;

export const SEND_VERIFICATION_LINK = gql`
  mutation SendVerificationLink($email: String!) {
    sendVerificationLink(email: $email) {
      message
      status
      success
    }
  }
`;

export const VERIFY_USER = gql`
  mutation VerifyUser($token: String!) {
    verifyUser(token: $token) {
      accessToken
      profile {
        id
        avatar
      }
      refreshToken
      user {
        email
        username
        firstName
        lastName
        isVerified
        id
        profile {
          id
          avatar
        }
      }
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
  mutation RemoveIssue($issueId: ID!, $projectId: ID!) {
    removeIssue(issueId: $issueId, projectId: $projectId) {
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
  mutation RemoveAssineeOfIssue($issueId: ID!) {
    removeAssineeOfIssue(issueId: $issueId) {
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
