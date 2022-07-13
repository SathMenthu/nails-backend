import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../users/entities/user.entity';
import { Categories } from '../../types/management/tariff';
import { OrderReservationModel, TariffModel } from '../../types';

@Entity()
export class Tariff extends BaseEntity implements TariffModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  // There is a string value because price can be on range or can be as description like 'individual price'
  @Column({ length: 15 })
  price: string;

  @Column()
  priority: number;

  @Column({ type: 'enum', enum: Categories })
  category: Categories;

  @OneToMany(
    () => OrderReservation,
    (orderReservation) => orderReservation.id,
    {
      onDelete: 'SET NULL',
    },
  )
  orderReservation: OrderReservation[];
}

@Entity()
export class OrderReservation
  extends BaseEntity
  implements OrderReservationModel
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  date: Date;

  @Column({ length: 255 })
  comment: string;

  // There is a string value because price can be on range or can be as description like 'individual price'
  @Column({ default: false })
  confirmed: boolean;

  @ManyToOne(() => Tariff, (tariff) => tariff.id)
  tariff: Tariff;

  @ManyToOne(() => Users, (user) => user.id)
  user: Users;
}
