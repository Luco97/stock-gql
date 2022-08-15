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
    return new Promise<SignInOutput>((resolve, reject) =>
      this._userRepo.userRepo
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .orWhere('user.username = :username', { username })
        .getCount()
        .then((user) => {
          if (user)
            resolve({ status: HttpStatus.CONFLICT, message: 'already exist' });
          else
            this._userRepo.userRepo
              .save(
                this._userRepo.userRepo.create({
                  email,
                  password,
                  username,
                  type: 'basic',
                }),
              )
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
