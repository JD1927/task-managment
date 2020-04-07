import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwtDecode from 'jwt-decode';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { SignInResponse } from './model/sign-in.model.response';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  private logger = new Logger('TaskRepository');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: SignUpCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<SignInResponse> {
    const user = await this.userRepository.validateUserPassword(
      signInCredentialsDto,
    );

    if (!user) {
      throw new UnauthorizedException(`Invalid credentials`);
    }
    const { username, name, birthDate } = user;

    const payload: JwtPayload = { username, name, birthDate };
    const accessToken = this.jwtService.sign(payload);

    const decodedAccestoken = jwtDecode(accessToken);
    const { exp: expiresAt } = decodedAccestoken;

    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken, name, username, birthDate, expiresAt };
  }
}
