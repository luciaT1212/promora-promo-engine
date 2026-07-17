import { Order } from '../entities/order';

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<void>;
  countPaidByBuyer(
    buyerId: string,
    excludeOrderIds?: readonly string[],
  ): Promise<number>;
}
