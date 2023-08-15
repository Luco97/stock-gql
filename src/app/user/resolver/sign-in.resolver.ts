import { HttpStatus } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { SignInInput } from '../inputs/sign-in.input';
import { SignInOutput } from '../outputs/sign-in.output';
import { UserRepositoryService } from '../repository/user-repository.service';

@Resolver()
export class SignInResolver {
  constructor(private _userRepo: UserRepositoryService) {}

  @Mutation(() => SignInOutput, {
    name: 'register_user',
    description: 'user register mutation',
  })
  async registerUser(
    @Args('user') createUser: SignInInput,
  ): Promise<SignInOutput> {
    const { email, password, username } = createUser;
    return new Promise<SignInOutput>((resolve, reject) =>
      this._userRepo
        .register_user({ email, username })
        .then((user) => {
          if (user)
            resolve({ status: HttpStatus.CONFLICT, message: 'already exist' });
          else
            this._userRepo
              .create_user({ email, username, password })
              .then(() =>
                resolve({
                  status: HttpStatus.OK,
                  message: 'user created',
                }),
              )
              .catch((error) => reject(error));
        })
        .catch((error) => reject(error)),
    );
  }
}
