import { Injectable } from '@nestjs/common';
import { OrderReservation, Tariff } from './entities/management.entity';
import { DefaultResponse } from '../types';
import { newTariff } from '../types/management/tariff';
import {
  getReservationForUserResponse,
  orderReservationFromQuery,
  orderReservationAfterFiltration,
  ordersReservationAfterFiltrationResponse,
  newReservation,
  updateReservation,
} from '../types/management/order-reservation';
import { Users } from '../users/entities/user.entity';

@Injectable()
export class ManagementService {
  async findAllTariff(): Promise<Tariff[]> {
    return await Tariff.find();
  }

  async addTariff({
    name,
    price,
    category,
    priority,
  }: newTariff): Promise<DefaultResponse> {
    try {
      const tariff = new Tariff();
      tariff.name = name;
      tariff.price = price;
      tariff.category = category;
      tariff.priority = priority;

      await tariff.save();

      return {
        message: 'Pomyślnie dodano nową pozycje w cenniku.',
        isSuccess: true,
      };
    } catch (e) {
      return {
        message: 'Wystąpił błąd podczas dodawania pozycji w cenniku.',
        isSuccess: false,
      };
    }
  }

  async deleteTariff(id: string) {
    try {
      await Tariff.delete(id);
      return {
        message: 'Pomyślnie usunięto pozycje w cenniku.',
        isSuccess: true,
      };
    } catch (e) {
      return {
        message: 'Wystąpił błąd podczas usuwania pozycji w cenniku.',
        isSuccess: false,
      };
    }
  }

  async updateTariff(
    id: string,
    { name, price, category, priority }: newTariff,
  ): Promise<DefaultResponse> {
    try {
      const tariff = await Tariff.findOneBy({ id });
      tariff.name = name;
      tariff.price = price;
      tariff.category = category;
      tariff.priority = priority;

      await tariff.save();

      return {
        message: 'Pomyślnie zaktualizowano  pozycje w cenniku.',
        isSuccess: true,
      };
    } catch (e) {
      return {
        message: 'Wystąpił błąd podczas aktualizacji pozycji w cenniku.',
        isSuccess: false,
      };
    }
  }

  async getAllReservations(): Promise<ordersReservationAfterFiltrationResponse> {
    try {
      const orders: orderReservationFromQuery[] =
        await OrderReservation.createQueryBuilder('OrderReservation')
          .leftJoinAndSelect('OrderReservation.user', 'user')
          .leftJoinAndSelect('OrderReservation.tariff', 'tariff')
          .select([
            'OrderReservation.id as id',
            'OrderReservation.confirmed as confirmed',
            'OrderReservation.comment as comment',
            'OrderReservation.date as date',
            'user.name',
            'user.lastname',
            'user.phoneNumber',
            'user.email',
            'tariff.name',
          ])
          .getRawMany();

      const ordersAfterFiltration: orderReservationAfterFiltration[] = [];
      for (const {
        id,
        confirmed,
        comment,
        user_name,
        user_lastname,
        user_phoneNumber,
        tariff_name,
        date,
      } of orders) {
        const payload: orderReservationAfterFiltration = {
          comment: '',
          confirmed: false,
          id: '',
          date: new Date(),
          tariff: { name: '' },
          user: { lastname: '', name: '', phoneNumber: 0 },
        };
        payload.id = id;
        payload.date = date;
        payload.confirmed = confirmed;
        payload.comment = comment;
        payload.user.name = user_name;
        payload.user.lastname = user_lastname;
        payload.user.phoneNumber = user_phoneNumber;
        payload.tariff.name = tariff_name;
        ordersAfterFiltration.push(payload);
      }
      return {
        isSuccess: true,
        message: 'Pomyślnie pobierano liste wszystkich rezerwacji.',
        orders: ordersAfterFiltration,
      };
    } catch (e) {
      return {
        isSuccess: false,
        message:
          'Wystąpił błąd podczas pobierania listy wszystkich rezerwacji.',
      };
    }
  }

  async getReservationsForUser(
    user: Users,
  ): Promise<getReservationForUserResponse> {
    try {
      const orders = await OrderReservation.find({
        relations: ['tariff'],
        where: {
          user: {
            id: user.id,
          },
        },
      });

      return {
        isSuccess: true,
        message: 'Pomyślnie pobrano listę rezerwacji.',
        orders,
      };
    } catch (e) {
      return {
        isSuccess: false,
        message: 'Wystąpił błąd podczas pobrania listy rezerwacji.',
      };
    }
  }

  async deleteReservation(id: string) {
    try {
      await OrderReservation.delete(id);
      return {
        message: 'Pomyślnie anulowano rejestracje.',
        isSuccess: true,
      };
    } catch (e) {
      return {
        message: 'Wystąpił błąd podczas anulowania rejestracji.',
        isSuccess: false,
      };
    }
  }

  async createReservation(user: Users, payload: newReservation) {
    try {
      const reservation = new OrderReservation();
      reservation.user = user;
      const tariff = await Tariff.findOneBy({ name: payload.tariffName });
      reservation.tariff = tariff;
      reservation.date = payload.date;
      reservation.comment = payload.comment ? payload.comment : '';
      await reservation.save();
      return {
        isSuccess: true,
        message: 'Pomyślnie zapisano rejestracje.',
      };
    } catch (e) {
      if (e.message.includes('Duplicate')) {
        return {
          isSuccess: false,
          message: 'Termin jest już zajęty!',
        };
      }
      return {
        isSuccess: false,
        message: 'Wystąpił błąd podczas tworzenia rezerwacji.',
      };
    }
  }

  async updateReservation({ confirmed }: updateReservation, id: string) {
    try {
      const reservation = await OrderReservation.findOneBy({ id });
      if (!reservation) throw new Error('Nie znaleziono rezerwacji.');
      reservation.confirmed = confirmed;
      await reservation.save();
      return {
        isSuccess: true,
        message: 'Pomyślnie zaktualizowano rezerwację.',
      };
    } catch (e) {
      if (e.message === 'Nie znaleziono rezerwacji.') {
        return {
          isSuccess: false,
          message: e.message,
        };
      } else {
        return {
          isSuccess: false,
          message: 'Wystąpił błąd podczas edycji rezerwacji',
        };
      }
    }
  }
}
