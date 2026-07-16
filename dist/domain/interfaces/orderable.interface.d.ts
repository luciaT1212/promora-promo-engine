import { OrderContext } from '../value-objects/order-context';
export interface OrderableInterface {
    getSubtotal(): number;
    getOrderContext(): OrderContext;
}
