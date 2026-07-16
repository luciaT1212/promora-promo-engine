import { BuyerProfile } from '../entities/buyer-profile';
export declare class OrderContext {
    readonly buyerProfile: BuyerProfile;
    readonly categoryId: string;
    readonly currentOrders: readonly string[];
    constructor(buyerProfile: BuyerProfile, categoryId: string, currentOrders: readonly string[]);
}
