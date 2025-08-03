import { gql } from '@apollo/client';

export const SIGNUP_USER = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      message
      status
      success
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        firstName
        lastName
        isVerified
         profile {
         avatar
      }
      }
      accessToken
      refreshToken
    }
  }
`;

export const SEND_VERIFICATION_LINK = gql`
  mutation SendVerificationLink($email: String!) {
    sendVerificationLink(email: $email) {
      message
      status
      success
    }
  }
`;

export const VERIFY_USER = gql`
  mutation VerifyUser($token: String!) {
    verifyUser(token: $token) {
      accessToken
      profile {
        id
        avatar
      }
      refreshToken
      user {
        email
        firstName
        lastName
        isVerified
        id
        profile {
          id
          avatar
        }
      }
    }
  }
`;


export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;
