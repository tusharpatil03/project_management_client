import { gql } from '@apollo/client';

export const CHECK_AUTH = gql`
  query {
    checkAuth {
      id
      firstName
      lastName
      email
      isVerified
      profile {
        avatar
      }
    }
  }
`;
