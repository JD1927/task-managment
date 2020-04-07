export interface SignInResponse {
  accessToken: string;
  username: string;
  name: string;
  birthDate: string;
  expiresAt?: number;
}
