import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { Payload } from '../interface/payload.interface';

@Injectable()
export class AuthService {
  constructor(private _jwtService: JwtService) {}

  genJWT(object: { id: number; name: string; type: string }): string {
    const { id, name, type } = object;
    return this._jwtService.sign({
      sub: name,
      context: {
        username: name,
        extra: id,
        type,
      },
    });
  }

  verify(token: string): Payload {
    return this._jwtService.verify<Payload>(token, {
      secret: process.env.SECRET_KEY,
    });
  }

  validateToken(token: string): boolean {
    try {
      const validation = this.verify(token);
      if (validation.context.username && validation.context.extra) return true;
    } catch (error) {
      return false;
    }
  }

  userID(token: string): number {
    try {
      const payload = this.verify(token);
      if (payload.context.username && payload.context.extra)
        return payload?.context?.extra;
    } catch (error) {
      return -1;
    }
  }

  userType(token: string): string {
    try {
      const payload = this.verify(token);
      if (payload.context.username && payload.context.extra)
        return payload?.context?.type;
    } catch (error) {
      return '';
    }
  }

  getContext(token: string): { id?: number; name?: string; type?: string } {
    try {
      const payload = this.verify(token);
      if (payload.context.username && payload.context.extra)
        return {
          id: payload.context.extra,
          type: payload.context.type,
          name: payload.context.username,
        };
    } catch (error) {
      return {};
    }
  }
}
