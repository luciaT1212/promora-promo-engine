import { BuyerFactory } from '../../testing/factories/buyer.factory';
import { OrderStatus } from './order-status';
import { OrderContext } from '../value-objects/order-context';
import { ProductOrder } from './product-order';
import { ServiceOrder } from './service-order';
import { SubscriptionOrder } from './subscription-order';

describe('Tipos de orden', () => {
  it.each([ServiceOrder, ProductOrder, SubscriptionOrder])(
    '%s implementa el contrato de orden',
    (OrderClass) => {
      const context = new OrderContext(BuyerFactory.create(), 'category', []);
      const order = new OrderClass('order', 25, context, OrderStatus.PENDING);
      expect(order.getSubtotal()).toBe(25);
      expect(order.getOrderContext()).toBe(context);
    },
  );
});
