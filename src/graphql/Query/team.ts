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

export const GET_ALL_TEAMS = gql`
  query GetAllTeams {
    getAllTeams {
      id
      name
      creatorId
      users {
        id
        role
        user {
          id
          firstName
          lastName
          email
          profile{
            id
            avatar
          }
        }
      }
    }
  }
`;
