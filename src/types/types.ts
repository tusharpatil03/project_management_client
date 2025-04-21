export type AuthInput = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'Admin' | 'User';
};

export type AuthResponce = {
    login: {
        accessToken: string;
    };
    signup: {
        accessToken: string;
    };
};
