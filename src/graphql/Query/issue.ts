import { gql } from '@apollo/client';

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
        username
      }
    }
  }
`;
