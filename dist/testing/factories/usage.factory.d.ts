import { PromoCodeUsage } from '../../domain/entities/promo-code-usage';
export interface UsageFactoryOverrides {
    id?: string;
    promoCodeId?: string;
    orderId?: string;
    buyerId?: string;
    discountAmount?: number;
    isPaid?: boolean;
    createdAt?: Date;
}
export declare class UsageFactory {
    static create(overrides?: UsageFactoryOverrides): PromoCodeUsage;
    static unpaid(overrides?: UsageFactoryOverrides): PromoCodeUsage;
}
