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
    const req: Request = context.getArgByIndex(2).req;
    const { id, name, type } = this._authService.getContext(
      req.headers?.authorization,
    );
    req.headers['user_id'] = id.toString();
    req.headers['user_name'] = name;
    req.headers['user_type'] = type;

    return next.handle();
  }
}
