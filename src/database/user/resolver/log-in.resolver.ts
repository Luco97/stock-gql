import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserRepositoryService } from '../repository/user-repository.service';
import { response } from '../outputs/response.output';
import { LogIn } from '../inputs/log-in.input';

@Resolver()
export class LogInResolver {
  constructor(private _userRepo: UserRepositoryService) {}

  @Mutation(() => response)
  async logIn(@Args('user') loginUser: LogIn) {}
}
