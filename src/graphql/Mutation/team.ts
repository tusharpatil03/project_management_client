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

// const inputs = gql`
//   input addTeamMemberInput {
//     memberId: ID!
//     teamId: ID!
//     role: String!
//   }
// `;

export const ADD_TEAM_MEMBER = gql`
  mutation AddmemberInTeam($input: addTeamMemberInput!) {
    addTeamMember(input: $input) {
      id
      userId
      teamId
      user {
        id
        email
        firstName
        lastName
        profile {
          id
          avatar
        }
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
