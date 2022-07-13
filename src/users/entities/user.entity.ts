import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RolesEnum, UserWithDetails } from '../../types';
import { OrderReservation } from '../../management/entities/management.entity';

@Entity()
export class Users extends BaseEntity implements UserWithDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 255,
  })
  email: string;

  @Column({
    length: 255,
  })
  password: string;

  @Column({
    length: 64,
  })
  name: string;

  @Column({
    length: 64,
  })
  lastname: string;

  @Column({ nullable: true })
  phoneNumber: number;

  @Column({
    type: 'set',
    enum: RolesEnum,
  })
  permissions: RolesEnum[];

  @OneToMany(
    () => OrderReservation,
    (orderReservation) => orderReservation.id,
    {
      onDelete: 'SET NULL',
    },
  )
  orderReservations: OrderReservation[];

  @Column({ nullable: true })
  activeTokenId: string | null;

  @Column({ type: 'timestamp' })
  createdAt: string = Date.now().toLocaleString();
}
