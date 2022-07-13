import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ManagementService } from './management.service';
import { Tariff } from './entities/management.entity';
import { DefaultResponse } from '../types';
import { newTariff } from '../types/management/tariff';
import {
  getReservationForUserResponse,
  newReservation,
  ordersReservationAfterFiltrationResponse,
  updateReservation,
} from '../types/management/order-reservation';
import { Users } from '../users/entities/user.entity';
import { UserObject } from '../decorators/user.object.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('management')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  // TARIFF
  @Get('tariff')
  getTariff(): Promise<Tariff[]> {
    return this.managementService.findAllTariff();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('tariff')
  addTariff(@Body() payload: newTariff): Promise<DefaultResponse> {
    return this.managementService.addTariff(payload);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('tariff/:id')
  deleteTariff(@Param('id') id: string) {
    return this.managementService.deleteTariff(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('tariff/:id')
  updateTariff(
    @Param('id') id: string,
    @Body() payload: newTariff,
  ): Promise<DefaultResponse> {
    return this.managementService.updateTariff(id, payload);
  }

  // RESERVATION

  @UseGuards(AuthGuard('jwt'))
  @Get('reservations')
  getAllReservations(): Promise<ordersReservationAfterFiltrationResponse> {
    return this.managementService.getAllReservations();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('reservation/user')
  getReservationForUser(
    @UserObject()
    user: Users,
  ): Promise<getReservationForUserResponse> {
    return this.managementService.getReservationsForUser(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('reservation')
  addReservation(
    @UserObject()
    user: Users,
    @Body() payload: newReservation,
  ) {
    return this.managementService.createReservation(user, payload);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('reservation/:id')
  updateReservation(
    @Body() payload: updateReservation,
    @Param('id') id: string,
  ) {
    return this.managementService.updateReservation(payload, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('reservation/:id')
  deleteReservation(@Param('id') id: string) {
    return this.managementService.deleteReservation(id);
  }
}
