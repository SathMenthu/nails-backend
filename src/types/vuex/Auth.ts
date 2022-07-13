import { OrderReservationModel } from '../management';
import { Tariff } from '../management/tariff';
import { User } from '../users/user';

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  toastAlert: null | string;
  toastMessage: null | string;
  tariffList: Tariff[];
  userReservationList: OrderReservationModel[];
  adminReservationList: OrderReservationModel[];
}
