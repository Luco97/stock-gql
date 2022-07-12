import { HttpStatus } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { SignInInput } from '../inputs/sign-in.input';
import { SignInOutput } from '../outputs/sign-in.output';
import { UserRepositoryService } from '../repository/user-repository.service';

@Resolver()
export class SignInResolver {
  constructor(private _userRepo: UserRepositoryService) {}

  @Mutation(() => SignInOutput)
  async signIn(@Args('user') createUser: SignInInput): Promise<SignInOutput> {
    const { email, password, username } = createUser;
    const findOne = await this._userRepo.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .orWhere('user.username = :username', { username })
      .getCount();
    if (findOne)
      return { status: HttpStatus.CONFLICT, message: 'already exist' };
    else {
      const newUser = this._userRepo.userRepo.create({
        email,
        password,
        username,
        type: 'basic',
      });
      await this._userRepo.userRepo.save(newUser);
      return {
        status: HttpStatus.OK,
        message: 'user created',
      };
    }
  }
}
