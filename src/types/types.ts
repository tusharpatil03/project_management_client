export type AuthInput = {
    email: string
    password: string
    role: 'Admin' | 'User'
}

export type LoginResponse = {
    signin: {
        accessToken: string
    }
}
