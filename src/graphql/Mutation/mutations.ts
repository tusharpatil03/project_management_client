import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation Mutation($input: AuthInput!) {
        login(input: $input) {
            accessToken
        }
    }
`;

export const SIGNUP_USER = gql`
    mutation Mutation($input: AuthInput!) {
        signup(input: $input) {
            accessToken
        }
    }
`;
