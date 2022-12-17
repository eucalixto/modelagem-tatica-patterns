import {
  Table,
  Model,
  PrimaryKey,
  Column,
  ForeignKey,
  BelongsTo,
  HasMany
} from 'sequelize-typescript';
import CustomerModel  from './customer.model';
import OrderItemModel from './order-item.model';

@Table({
  tableName: 'orders',
  timestamps: false
})
export default class OrderModel extends Model{
  @PrimaryKey
  @Column
  declare id: string;

  @ForeignKey(() => CustomerModel)
  @Column({allowNull: false})
  declare customerId: string;

  @BelongsTo(() => CustomerModel)
  declare customer: Awaited<CustomerModel>;

  @HasMany(() => OrderItemModel)
  declare items:  Awaited<OrderItemModel>[]

  @Column({allowNull: false})
  declare total: number;
}