import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { DefaultResponse, User, UserWithDetails } from '../types';
import {
  FindAllUsersResponse,
  UserDataAfterFiltrationResponse,
} from '../types/users/user.response';
import { Users } from './entities/user.entity';
import { UserObject } from '../decorators/user.object.decorator';

//@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  register(
    @Body() user: UserWithDetails,
  ): Promise<UserDataAfterFiltrationResponse> {
    return this.usersService.register(user);
  }

  @Get('/')
  findAll(): Promise<FindAllUsersResponse> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  findMe(@Req() request: { user: Users }) {
    return this.usersService.me(request.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserDataAfterFiltrationResponse> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() editedUser: User) {
    return this.usersService.update(id, editedUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DefaultResponse> {
    return this.usersService.remove(id);
  }
}
