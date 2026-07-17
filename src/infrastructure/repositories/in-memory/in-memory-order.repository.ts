import { Order } from '../../../domain/entities/order';
import { OrderStatus } from '../../../domain/entities/order-status';
import { IOrderRepository } from '../../../domain/interfaces/order.repository';

export class InMemoryOrderRepository implements IOrderRepository {
  private readonly store = new Map<string, Order>();
  async findById(id: string): Promise<Order | null> {
    return this.store.get(id) ?? null;
  }
  async save(order: Order): Promise<void> {
    this.store.set(order.id, order);
  }
  async countPaidByBuyer(
    buyerId: string,
    exclude: readonly string[] = [],
  ): Promise<number> {
    return [...this.store.values()].filter(
      (o) =>
        o.status === OrderStatus.PAID &&
        o.getOrderContext().buyerProfile.buyerId === buyerId &&
        !exclude.includes(o.id),
    ).length;
  }
  clear(): void {
    this.store.clear();
  }
}
