import { gql } from '@apollo/client';

export const GET_ISSUE_BY_ID = gql`
  query GetIssueById($issueId: ID!, $projectId: ID!) {
    getIssueById(issueId: $issueId, projectId: $projectId) {
      id
      title
      description
      status
      dueDate
      createdAt
      updatedAt
      assignee {
        id
        firstName
        lastName
        email
        profile {
          avatar
        }
      }
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

export const GET_ALL_ISSUES = gql`
  query GetAllIssues($projectId: ID!) {
    getAllIssues(projectId: $projectId) {
      id
      title
      description
      type
      status
      dueDate
      createdAt
      updatedAt
      projectId
      sprintId
      creatorId
      assignee {
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
