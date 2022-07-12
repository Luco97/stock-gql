import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '@Shared/auth';
import { Request } from 'express';
import { from, map, Observable, of } from 'rxjs';
import { UserRepositoryService } from '../user/repository/user-repository.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _userService: UserRepositoryService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getNext().req;
    if (this._authService.validateToken(req.headers?.authorization))
      return of(false);
    const id_user = this._authService.userID(req.headers?.authorization);
    return from(
      this._userService.userRepo
        .createQueryBuilder('user')
        .select(['user.type'])
        .where('user.id = :id_user', { id_user })
        .getCount(),
    ).pipe(map<number, boolean>((count) => (count ? true : false)));
  }
}
