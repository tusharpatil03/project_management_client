import { gql } from '@apollo/client';

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      message
      success
      status
    }
  }
`;

export const REMOVE_PROJECT = gql`
  mutation RemoveProject($projectId: ID!){
  removeProject(projectId: $projectId) {
    message
    status
    success
  }
}
`;
