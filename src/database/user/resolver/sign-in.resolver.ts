import { HttpStatus } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { SignIn } from '../inputs/sign-in.input';
import { response } from '../outputs/response.output';
import { UserRepositoryService } from '../repository/user-repository.service';

@Resolver(() => response)
export class SignInResolver {
  constructor(private _userRepo: UserRepositoryService) {}

  @Mutation(() => response)
  async signIn(@Args('user') createUser: SignIn): Promise<response> {
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
