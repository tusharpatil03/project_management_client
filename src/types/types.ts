export type SignupInput = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
};

export type LoginInput = {
    email: string;
    password: string;
}

export type AuthResponce = {
    login: {
        accessToken: string;
    };
    signup: {
        accessToken: string;
    };
};
