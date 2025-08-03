import { gql } from '@apollo/client';

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
