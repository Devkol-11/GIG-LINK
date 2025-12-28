export interface LoginUserCommand {
        email: string;
        password: string;
}

export interface LoginUserResult {
        message: string;
        tokens: {
                accessToken: string;
                refreshToken: string;
        };
}
