import { HttpStatus } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { compare } from 'bcrypt';

import { AuthService } from '@Shared/auth';
import { LogInInput } from '../inputs/log-in.input';
import { LogInOutput } from '../outputs/log-in.output';
import { UserRepositoryService } from '../repository/user-repository.service';

@Resolver()
export class LogInResolver {
  constructor(
    private _authService: AuthService,
    private _userRepo: UserRepositoryService,
  ) {}

  @Mutation(() => LogInOutput)
  async logIn(
    @Args('user') loginUser: LogInInput,
    @Context() context,
  ): Promise<LogInOutput> {
    const { email, password } = loginUser;
    const findOne = await this._userRepo.userRepo
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'user.password',
        'user.type',
      ])
      .where('user.email = :email', { email })
      .getOne();

    if (!findOne)
      return {
        status: HttpStatus.NOT_FOUND,
        message: `user doesn't exist`,
        token: '',
      };
    const isValid = await compare(password, findOne.password);
    if (!isValid)
      return {
        status: HttpStatus.NOT_FOUND,
        message: `user doesn't exist`,
        token: '',
      };
    return {
      status: HttpStatus.OK,
      message: 'user logged',
      token: this._authService.genJWT({
        id: findOne.id,
        name: findOne.username,
        type: findOne.type,
      }),
    };
  }
}
