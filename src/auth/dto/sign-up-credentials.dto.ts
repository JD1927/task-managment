import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  birthDate: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}/,
    {
      message: `password too weak`,
    },
  ) // https://gist.github.com/arielweinberger/18a29bfa17072444d45adaeeb8e92ddc
  password: string;
}
