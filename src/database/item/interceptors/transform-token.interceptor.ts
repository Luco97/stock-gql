import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { AuthService } from '@Shared/auth';

@Injectable()
export class TransformTokenInterceptor implements NestInterceptor {
  constructor(private _authService: AuthService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('---> ', context);
    const req: Request = context.getArgByIndex(2).req;
    // req.res.setHeader(
    //   'aaa',
    //   this._authService.userType(req.headers?.authorization),
    // );
    return next.handle();
  }
}
