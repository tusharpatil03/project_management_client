import { gql } from '@apollo/client'

export const LOGIN_USER = gql`
    mutation SignIn($signinInput: AuthInput!) {
        signin(input: $signinInput) {
            accessToken
        }
    }
`
