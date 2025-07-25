import { gql } from "@apollo/client";

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


export const REMOVE_SPRINT = gql`
  mutation RemoveSprint($sprintId: ID!, $projectId: ID!) {
    removeSprint(sprintId: $sprintId, projectId: $projectId) {
      success
      status
      message
    }
  }
`;