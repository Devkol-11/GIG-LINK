export interface LoginUserCommand {
  email: string;
  password: string;
}

export interface LoginUserResult {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
