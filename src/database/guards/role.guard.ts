import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Request } from 'express';
import { from, map, Observable, of } from 'rxjs';

import { AuthService } from '@Shared/auth';
import { UserRepositoryService } from '../user/repository/user-repository.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private _reflector: Reflector,
    private _authService: AuthService,
    private _userService: UserRepositoryService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getNext().req;
    const roles: string[] = this._reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!this._authService.validateToken(req.headers?.authorization))
      return of(false);
    const id_user = this._authService.userID(req.headers?.authorization);
    return from(
      this._userService.find_and_count_roles({ id_user, roles }),
    ).pipe(map<number, boolean>((count) => (count ? true : false)));
  }
}
