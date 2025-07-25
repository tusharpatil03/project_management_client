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

export const REMOVE_PROJECT = gql`
  mutation RemoveProject($projectId: ID!) {
    removeProject(projectId: $projectId) {
      success
      status
      message
    }
  }
`;
