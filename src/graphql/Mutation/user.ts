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
      refreshToken
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

export const UPDATE_USER_PROFILE = gql`
mutation UpdateProfile($input: UpdateProfileInput!){
  updateUserProfile(input: $input) {
    message
    success
    status
  }
}`;
