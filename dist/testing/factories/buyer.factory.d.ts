import { BuyerProfile } from '../../domain/entities/buyer-profile';
export declare class BuyerFactory {
    static create(overrides?: Partial<BuyerProfile>): BuyerProfile;
    static firstBuyer(): BuyerProfile;
    static withHistory(totalOrders: number): BuyerProfile;
}
