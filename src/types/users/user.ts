// eslint-disable-next-line import/no-cycle
import { OrderReservationModel } from '../management/order-reservation';
import { RolesEnum } from './roles.enum';

export type User = {
  email: string;
  password?: string;
  name: string;
  lastname: string;
  permissions: RolesEnum[];
};

export interface UserWithDetails extends User {
  id: string;
  phoneNumber: number;
  orderReservations: OrderReservationModel[];
}
