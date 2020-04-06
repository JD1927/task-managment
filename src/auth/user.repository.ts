import { duplicateUsernameCode } from './../shared/http-request.code';
import { SignUpCredentialsDto } from './dto/sign-up-credentials.dto';
import { Repository, EntityRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { SignInCredentialsDto } from './dto/sign-in-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async signUp(signUpCredentialsDto: SignUpCredentialsDto): Promise<void> {
    const { username, password, name, birthDate } = signUpCredentialsDto;

    const user = new User();
    user.username = username;
    user.name = name;
    user.birthDate = birthDate;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === duplicateUsernameCode) {
        throw new ConflictException(`username already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(signInCredentialsDto: SignInCredentialsDto): Promise<User> {
    const { username, password } = signInCredentialsDto;
    const user = await this.findOne({ username });

    if (user && await user.validatePassword(password)) {
      return user;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
