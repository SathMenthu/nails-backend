import { DefaultResponse } from '../general';
// eslint-disable-next-line import/no-cycle
import { UserWithDetails } from './user';

export interface FindUserResponse extends Omit<UserWithDetails, 'password'> {
  id: string;
}

export interface FindAllUsersResponse extends DefaultResponse {
  users?: FindUserResponse[];
}

export interface UserDataAfterFiltrationResponse extends DefaultResponse {
  userData?: FindUserResponse;
}
