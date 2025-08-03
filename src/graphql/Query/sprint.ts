import { gql } from '@apollo/client';

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

export const GET_ALL_SPRINTS = gql`
  query GetAllSprints($projectId: ID!) {
    getAllSprints(projectId: $projectId) {
      id
      title
      key
      description
      status
      dueDate
      projectId
      createdAt
      updatedAt
      creator {
        id
      }
      project {
        id
        name
      }
      issues {
        id
        title
        status
        dueDate
        type
        assignee {
          id
          firstName
          lastName
          profile{
            avatar
          }
        }
      }
    }
  }
`;
