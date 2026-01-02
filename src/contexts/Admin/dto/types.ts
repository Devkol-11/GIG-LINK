export interface AdminRegistrationRequest {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
}

export interface AdminRegistrationReply {
        message: string;
        accessToken: string;
        refreshToken: string;
}

export interface AdminLoginRequest {
        email: string;
        password: string;
}

export interface AdminLoginReply {
        message: string;
        accessToken: string;
        refreshToken: string;
}
