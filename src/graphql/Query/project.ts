import { gql } from '@apollo/client';

export const GET_RECENT_PROJECT = gql`
  query GetrecentProject {
    getRecentProject {
      createdAt
      creatorId
      description
      id
      key
      name
      status
      issues {
        id
        parent {
          id
        }
      }
      updatedAt
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($projectId: String) {
    getProject(projectId: $projectId) {
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
      status
      creatorId
      description
      createdAt
      updatedAt
      creator {
        id
        email
        firstName
        lastName
        profile {
          avatar
        }
      }
    }
  }
`;

export const GET_PROJECT_STAT = gql`
  query GetProjectStat($projectId: ID!) {
    getProjectStat(projectId: $projectId) {
      totalIssues
      openIssues
      closedIssues
      inProgressIssues
      totalSprints
    }
  }
`;

export interface ProjectStat {
  totalIssues: number;
  openIssues: number;
  closedIssues: number;
  inProgressIssues: number;
  totalSprints: number;
  activeSprint: number;
}
