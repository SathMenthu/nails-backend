import { Inject, Injectable } from '@nestjs/common';
import { Users } from './entities/user.entity';

import {
  FindAllUsersResponse,
  FindUserResponse,
  UserDataAfterFiltrationResponse,
} from '../types/users/user.response';
import { DefaultResponse, RolesEnum, User, UserWithDetails } from '../types';
import { UtilitiesService } from '../utilities/utilities.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UtilitiesService)
    private readonly utilitiesService: UtilitiesService,
  ) {}

  filter(user: Users): FindUserResponse {
    const {
      id,
      email,
      name,
      lastname,
      phoneNumber,
      permissions,
      orderReservations,
    } = user;
    return {
      id,
      email,
      name,
      lastname,
      phoneNumber,
      permissions,
      orderReservations,
    };
  }

  async me(data: Users) {
    return this.filter(data);
  }

  async register(
    user: UserWithDetails,
  ): Promise<UserDataAfterFiltrationResponse> {
    const { email } = user;
    const foundUser = await Users.findOneBy({ email });
    if (foundUser) {
      return {
        message: 'Adres email już istnieje!',
        isSuccess: false,
      };
    } else {
      try {
        const { email, password, name, lastname, phoneNumber, permissions } =
          user;
        const newUser = new Users();
        newUser.email = email;
        newUser.password = this.utilitiesService.hashPwd(password);
        newUser.name = name;
        newUser.lastname = lastname;
        newUser.phoneNumber = phoneNumber;
        newUser.permissions = permissions
          ? [RolesEnum.USER, ...permissions]
          : [RolesEnum.USER];
        await newUser.save();
        const userData = this.filter(newUser);

        return {
          message: `Pomyślnie dodano użyktownika: ${email}.`,
          isSuccess: true,
          userData,
        };
      } catch (e) {
        console.log(e);
        return {
          message: 'Wystąpił błąd podczas tworzenia użytkownika.',
          isSuccess: false,
        };
      }
    }
  }

  async findAll(): Promise<FindAllUsersResponse> {
    try {
      const users = await Users.find();
      const userAfterFiltration: FindUserResponse[] = [];
      for (const user of users) {
        userAfterFiltration.push(this.filter(user));
      }
      return {
        users: userAfterFiltration,
        message: 'Pomyślnie pobrano listę użytkowników.',
        isSuccess: true,
      };
    } catch (e) {
      return {
        message: 'Wystąpił błąd podczas pobierania listy użytkowników.',
        isSuccess: false,
      };
    }
  }

  async findOne(id: string): Promise<UserDataAfterFiltrationResponse> {
    try {
      const userData = this.filter(await Users.findOneBy({ id }));
      if (userData) {
        return {
          userData,
          message: 'Pomyślnie pobrano dane użytkownika.',
          isSuccess: true,
        };
      } else {
        return {
          message: 'Nie znaleziono użytkownika.',
          isSuccess: false,
        };
      }
    } catch (e) {
      return {
        message: 'Wystąpił błąd przy próbie pobrania użytkownika.',
        isSuccess: false,
      };
    }
  }

  async update(
    id: string,
    editedUser: User,
  ): Promise<UserDataAfterFiltrationResponse> {
    const { email, password, name, lastname, permissions } = editedUser;
    const user = await Users.findOneBy({ id });
    if (user) {
      try {
        user.email = email;
        if (password) {
          user.password = this.utilitiesService.hashPwd(password);
        }
        user.name = name;
        user.lastname = lastname;
        user.permissions = permissions;
        await user.save();
        const userData = this.filter(user);
        return {
          message: `Pomyślnie zmieniono dane użytkownika: ${email}.`,
          userData,
          isSuccess: true,
        };
      } catch (e) {
        return {
          message: 'Wystąpił błąd podczas edycji użytkownika.',
          isSuccess: false,
        };
      }
    } else {
      return {
        message: 'Nie znaleziono użytkownika.',
        isSuccess: false,
      };
    }
  }

  async remove(id: string): Promise<DefaultResponse> {
    try {
      await Users.delete(id);
      return {
        message: `Pomyślnie usunięto użytkownika o id ${id}.`,
        isSuccess: true,
      };
    } catch (e) {
      return {
        message: `Wystąpił błąd podczas usuwania użytkownika o id ${id}.`,
        isSuccess: false,
      };
    }
  }
}
