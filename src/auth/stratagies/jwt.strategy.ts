import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from '../../users/entities/user.entity';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

function cookieExtractor(req: Request): null | string {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      ignoreExpiration: false,
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.TOKEN_SECRET,
    });
  }

  async validate(
    payload: JwtPayload,
    done: (error: UnauthorizedException | null, user: Users | boolean) => void,
  ) {
    if (!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }
    const user = await Users.findOneBy({ activeTokenId: payload.id });
    if (!user) {
      return done(new UnauthorizedException(), false);
    }

    done(null, user);
  }
}
