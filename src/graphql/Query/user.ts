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
        updatedAt
        createdAt
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
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: ID!) {
    getUserById(userId: $userId) {
      id
      firstName
      lastName
      email
      createdAt
      profile {
        avatar
        phone
        bio
        gender
        social {
          github
          linkedin
          twitter
        }
      }

      # Recent activities (limit should be handled server-side if available)
      activities {
        id
        action
        createdAt
        project {
          key
          name
        }
        issue {
          key
          title
        }
      }

      # Public projects the user is part of
      projects {
        key
        name
        description
        creator {
          firstName
          lastName
          profile {
            avatar
          }
        }
      }
    }
  }
`;

export const GET_USERS_BY_SEARCH = gql`
  query GetUserBySearch($search: String!) {
    getUsersBySearch(search: $search) {
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
`;
