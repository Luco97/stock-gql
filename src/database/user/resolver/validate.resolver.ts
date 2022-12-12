import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { HttpStatus } from '@nestjs/common';

import { Request } from 'express';

import { AuthService } from '@Shared/auth';
import { ValidateOutput } from '../outputs/validate.output';

@Resolver()
export class ValidateResolver {
  constructor(private _authService: AuthService) {}
  @Mutation(() => ValidateOutput)
  validateToken(@Context() context): Promise<ValidateOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const isValid: boolean = this._authService.validateToken(token);
    return new Promise<ValidateOutput>((resolve, reject) =>
      resolve({
        message: isValid ? 'everything is okay :)' : 'nao nao beibi',
        status: HttpStatus.ACCEPTED,
        isValid,
      }),
    );
  }

  @Mutation(() => ValidateOutput)
  validateTypeBasic(
    @Args('type') type: string,
    @Context() context,
  ): Promise<ValidateOutput> {
    const req: Request = context.req;
    const token: string = req.headers?.authorization;
    const isValid: boolean = this._authService.userType(token) == type;
    return new Promise<ValidateOutput>((resolve, reject) =>
      resolve({
        message: isValid ? 'everything is okay :)' : 'nao nao beibi',
        status: HttpStatus.ACCEPTED,
        isValid,
      }),
    );
  }
}
