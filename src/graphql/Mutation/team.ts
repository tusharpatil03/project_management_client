import { gql } from '@apollo/client';

export const CREATE_TEAM = gql`
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      id
      creatorId
    }
  }
`;

export const REMOVE_TEAM = gql`
  mutation RemoveTeam($teamId: ID!) {
    removeTeam(teamId: $teamId) {
      success
      status
      message
    }
  }
`;

export const ADD_TEAM_MEMBER = gql`
  mutation AddTeamMember($memberId: ID!, $teamId: ID!, $role: String!) {
    addTeamMember(memberId: $memberId, teamId: $teamId, role: $role) {
      id
      name
      members {
        id
        email
      }
    }
  }
`;

export const REMOVE_TEAM_MEMBER = gql`
  mutation RemoveTeamMember($memberId: ID!, $teamId: ID!) {
    removeTeamMember(memberId: $memberId, teamId: $teamId) {
      id
      name
      members {
        id
        email
      }
    }
  }
`;
