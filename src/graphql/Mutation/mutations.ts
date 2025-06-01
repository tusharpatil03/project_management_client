import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation Mutation($input: LoginInput!) {
        login(input: $input) {
            accessToken
        }
    }
`;

export const SIGNUP_USER = gql`
    mutation Mutation($input: SignupInput!) {
        signup(input: $input) {
            accessToken
        }
    }
`;
