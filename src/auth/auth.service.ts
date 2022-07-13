import { Inject, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import { JwtPayload, sign } from 'jsonwebtoken';
import { Users } from '../users/entities/user.entity';
import { UtilitiesService } from '../utilities/utilities.service';
import { AuthLoginData, TokenPayload } from '../types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UtilitiesService)
    private readonly utilitiesService?: UtilitiesService,
  ) {}

  // Create JWT Token

  private createToken(currentTokenId: string): TokenPayload {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 1000 * 60 * 60 * 24 * 31; // 1 Month
    const accessToken = sign(payload, process.env.TOKEN_SECRET, { expiresIn });
    return {
      accessToken,
      expiresIn,
    };
  }

  // Function that looks for token in database, and create new by createToken function

  private async generateToken(user: Users): Promise<string> {
    let token: string;
    let userWithThisToken = null;
    do {
      token = uuid();
      userWithThisToken = await Users.findOneBy({ activeTokenId: token });
    } while (!!userWithThisToken);
    user.activeTokenId = token;
    await user.save();

    return token;
  }

  // Login function

  async login(request: AuthLoginData, response: Response): Promise<Response> {
    try {
      const user = await Users.findOneBy({
        email: request.email,
        password: this.utilitiesService.hashPwd(request.password),
      });
      if (!user) {
        return response.json({
          message: 'Nieprawidłowe dane logowania.',
          isSuccess: false,
        });
      }
      const token = this.createToken(await this.generateToken(user));

      return response
        .cookie('jwt', token.accessToken, {
          secure: false,
          domain: process.env.FRONT_DOMAIN,
          httpOnly: true,
          expires: new Date(new Date().getTime() + token.expiresIn),
        })
        .json({
          isSuccess: true,
          message: 'Pomyślnie Zalogowano Użytkwonika.',
          userData: [
            {
              id: user.id,
              email: user.email,
              name: user.name,
              lastname: user.lastname,
              phoneNumber: user.phoneNumber,
              permissions: user.permissions,
            },
          ],
        });
    } catch (e) {
      return response.json({
        isSuccess: false,
        message: e.message,
      });
    }
  }

  // Logout function protected by AuthGuard

  public async logout(user: Users, res: Response): Promise<Response> {
    try {
      // Clear Token in Database
      user.activeTokenId = null;
      await user.save();

      // Clear Cookies
      res.clearCookie('jwt', {
        secure: false,
        domain: process.env.FRONT_DOMAIN,
        httpOnly: true,
      });

      // Response when successfully logout
      return res.json({
        isSuccess: true,
        message: 'Pomyślnie wylogowano użytkownika.',
      });
    } catch (e) {
      console.log(e);
      // Response when got error during the logout
      return res.json({
        isSuccess: false,
        message: 'Wystąpił błąd podczas wylogowania użytkownika!',
      });
    }
  }
}
