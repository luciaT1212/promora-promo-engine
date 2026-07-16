import { v4 as uuid } from 'uuid';
import { Order } from '../../domain/entities/order';
import { OrderContext } from '../../domain/value-objects/order-context';
import { BuyerProfile } from '../../domain/entities/buyer-profile';
import { BuyerFactory } from './buyer.factory';

export interface OrderFactoryOverrides {
  id?: string;
  subtotal?: number;
  categoryId?: string;
  buyer?: BuyerProfile;
  currentOrders?: readonly string[];
}

export class OrderFactory {
  static create(overrides: OrderFactoryOverrides = {}): Order {
    const buyer = overrides.buyer ?? BuyerFactory.create();
    const context = new OrderContext(
      buyer,
      overrides.categoryId ?? 'cat-default',
      overrides.currentOrders ?? [],
    );
    return new Order(
      overrides.id ?? uuid(),
      overrides.subtotal ?? 100,
      context,
    );
  }
}
