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
    const { id, name, type } = this._authService.getContext(
      req.headers?.authorization,
    );
    // context.getArgByIndex(2).req.res.set('user_id', id.toString());
    // context.getArgByIndex(2).req.res.set('user_name', name);
    // context.getArgByIndex(2).req.res.set('user_type', type);
    req.headers['user_id'] = id.toString();
    req.headers['user_name'] = name;
    req.headers['user_type'] = type;

    // req.res.setHeader(
    //   'aaa',
    //   this._authService.userType(req.headers?.authorization),
    // );
    return next.handle();
  }
}
