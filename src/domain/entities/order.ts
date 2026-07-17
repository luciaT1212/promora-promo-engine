import { OrderableInterface } from '../interfaces/orderable.interface';
import { OrderContext } from '../value-objects/order-context';
import { OrderStatus } from './order-status';

export class Order implements OrderableInterface {
  constructor(
    public readonly id: string,
    private readonly subtotal: number,
    private readonly context: OrderContext,
    public readonly status: OrderStatus = OrderStatus.DRAFT,
  ) {}

  getSubtotal(): number {
    return this.subtotal;
  }

  getOrderContext(): OrderContext {
    return this.context;
  }
}
