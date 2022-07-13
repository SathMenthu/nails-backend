import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from './stratagies/jwt.strategy';
import { UtilitiesService } from '../utilities/utilities.service';
import { UtilitiesModule } from '../utilities/utilities.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy, UtilitiesService],
  imports: [UsersModule, UtilitiesModule],
})
export class AuthModule {}
