// eslint-disable-next-line import/no-cycle
import { OrderReservationModel } from './order-reservation';

export enum Categories {
  CARE = 'CARE',
  STYLING = 'STYLING',
}

export interface newTariff {
  name: string;
  price: string;
  priority: number;
  category: Categories;
}

export interface Tariff {
  id: string;
  name: string;
  price: string;
  priority: number;
  category: Categories;
}

export interface TariffModel extends Tariff {
  orderReservation: OrderReservationModel[];
}
