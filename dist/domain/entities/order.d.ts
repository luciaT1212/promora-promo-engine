import { OrderableInterface } from '../interfaces/orderable.interface';
import { OrderContext } from '../value-objects/order-context';
export declare class Order implements OrderableInterface {
    readonly id: string;
    private readonly subtotal;
    private readonly context;
    constructor(id: string, subtotal: number, context: OrderContext);
    getSubtotal(): number;
    getOrderContext(): OrderContext;
}
