import { gql } from '@apollo/client';

export const GET_ALL_PROJECTS = gql`
    query GetAllProjects {
        getAllProjects {
            id
            name
        }
    }
`;

export const GET_ALL_TASKS = gql`
    query GetAllTasks($projectId: ID!) {
  getAllTasks(projectId: $projectId) {
    id
    assignee {
      id
      profile {
        firstName
        lastName
        avatar
      }
    }
  }
}

`