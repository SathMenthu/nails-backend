import { UserWithDetails } from '../users';

export interface TokenPayload {
  accessToken: string;
  expiresIn: number;
}

export interface UserAuthRequest {
  user: UserWithDetails;
}

export interface AuthLoginData {
  email: string;
  password: string;
}
