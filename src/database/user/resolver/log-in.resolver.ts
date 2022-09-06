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

  @Mutation(() => LogInOutput, { description: 'user logIn mutation' })
  async logIn(@Args('user') loginUser: LogInInput): Promise<LogInOutput> {
    const { email, password } = loginUser;
    return new Promise<LogInOutput>((resolve, reject) =>
      this._userRepo.userRepo
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.username',
          'user.email',
          'user.password',
          'user.type',
        ])
        .where('user.email = :email', { email })
        .getOne()
        .then((user) => {
          if (!user)
            resolve({
              status: HttpStatus.NOT_FOUND,
              message: `user doesn't exist`,
              token: '',
            });
          compare(password, user.password)
            .then((isValid) => {
              if (!isValid)
                return resolve({
                  status: HttpStatus.NOT_FOUND,
                  message: `user doesn't exist`,
                  token: '',
                });
              resolve({
                status: HttpStatus.OK,
                message: 'user logged',
                token: this._authService.genJWT({
                  id: user.id,
                  name: user.username,
                  type: user.type,
                }),
              });
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error)),
    );
  }
}
