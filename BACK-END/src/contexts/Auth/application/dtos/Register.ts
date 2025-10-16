export interface RegisterUserCommand {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export interface RegisterUserResult {
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
