import { Order } from '../../domain/entities/order';
import { BuyerProfile } from '../../domain/entities/buyer-profile';
export interface OrderFactoryOverrides {
    id?: string;
    subtotal?: number;
    categoryId?: string;
    buyer?: BuyerProfile;
    currentOrders?: readonly string[];
}
export declare class OrderFactory {
    static create(overrides?: OrderFactoryOverrides): Order;
}
