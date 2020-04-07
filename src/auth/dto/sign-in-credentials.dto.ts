import { IsString } from 'class-validator';

export class SignInCredentialsDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
