import { OrderableInterface } from '../interfaces/orderable.interface';
import { BuyerProfile } from '../entities/buyer-profile';
import { PromoCode } from '../entities/promo-code';
export declare class ValidationContext {
    readonly promoCodeString: string;
    readonly order: OrderableInterface;
    readonly buyer: BuyerProfile;
    promo: PromoCode | null;
    constructor(promoCodeString: string, order: OrderableInterface, buyer: BuyerProfile, promo?: PromoCode | null);
}
