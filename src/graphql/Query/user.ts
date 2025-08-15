import { gql } from '@apollo/client';

export const GET_ALL_USER_TEAMS = gql`
  query GetAllUserTeams($userId: ID!) {
    getAllUserTeams(userId: $userId) {
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

export const GET_USER_INFO = gql`
query GetUserInfo {
  getUserInfo {
    id
    email
    firstName
    lastName
    profile {
      id
      avatar
    }
    projects {
      id
      key
      name
      description
      status
      creatorId
      creator {
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
}
`

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: ID!) {
    getUserById(userId: $userId) {
      id
      email
      role
      createdAt
      updatedAt
      firstName
      lastName
      phone
      gender
      avatar
      profile {
        id
        avatar
        phone
        gender
        social {
          id
          github
          facebook
          twitter
          linkedin
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      projects {
        id
        key
        name
      }
      sprints {
        id
        title
      }
      teams {
        id
        name
      }
      createdTeams {
        id
        name
      }
      createdIssues {
        id
        title
      }
      assignedIssues {
        id
        title
      }
    }
  }
`;
