import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Users } from '../users/entities/user.entity';
import { UserObject } from '../decorators/user.object.decorator';
import { AuthLoginData } from '../types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() request: AuthLoginData,
    @Res() response: Response,
  ): Promise<Response> {
    return await this.authService.login(request, response);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  async logout(
    @UserObject() user: Users,
    @Res() res: Response,
  ): Promise<Response> {
    return this.authService.logout(user, res);
  }
}
