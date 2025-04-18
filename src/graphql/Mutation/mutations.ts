import { gql } from '@apollo/client'


export const SIGNIN_USER = gql`
    mutation Mutation($input: AuthInput!) {
        signin(input: $input) {
            accessToken
        }
    }
`

export const SIGNUP_USER = gql`
    mutation Mutation($input: AuthInput!) {
        signup(input: $input) {
            accessToken
        }
    }
`
