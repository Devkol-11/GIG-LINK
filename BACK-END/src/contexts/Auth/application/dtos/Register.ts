export interface RegisterUserCommand {
  email: string;
  password: string;
  phoneNumber: number;
  firstName: string;
  lastName: string;
}

export interface RegisterUserResult {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
  };
  token: {
    accessToken: string;
  };
}
