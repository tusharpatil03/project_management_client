import { gql } from '@apollo/client';

export const GET_ALL_MEMBERS = gql`
  query GetProjectTeamsMembers($projectId: ID!) {
    getProjectTeamsMembers(projectId: $projectId) {
      id
      firstName
      lastName
      email
      profile {
        avatar
      }
    }
  }
`;

export const GET_TEAM_BY_ID = gql`
  query GetTeamById($teamId: ID!) {
    getTeamById(teamId: $teamId) {
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
