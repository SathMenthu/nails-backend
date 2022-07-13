/* eslint-disable import/no-cycle */
import { DefaultResponse } from '../general';
import { UserWithDetails } from '../users';
import { TariffModel } from './tariff';

export interface orderReservationFromQuery {
  id: string;
  confirmed: boolean;
  date: Date;
  comment: string;
  user_name: string;
  user_lastname: string;
  user_phoneNumber: number;
  tariff_name: string;
}
export interface orderReservationAfterFiltration {
  id: string;
  confirmed: boolean;
  comment: string;
  date: Date;
  user: {
    name: string;
    lastname: string;
    phoneNumber: number;
  };
  tariff: {
    name: string;
  };
}

export interface ordersReservationAfterFiltrationResponse
  extends DefaultResponse {
  orders?: orderReservationAfterFiltration[];
}

export interface newReservation {
  date: Date;
  comment: string;
  tariffName: string;
}

export interface updateReservation extends newReservation {
  confirmed: boolean;
}

export interface OrderReservationModel {
  id: string;
  date: Date;
  comment: string;
  confirmed: boolean;
  tariff: TariffModel;
  user: UserWithDetails;
}

export interface getReservationForUserResponse extends DefaultResponse {
  orders?: OrderReservationModel[];
}
