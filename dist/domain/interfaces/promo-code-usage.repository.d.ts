import { PromoCodeUsage } from '../entities/promo-code-usage';
export interface IPromoCodeUsageRepository {
    save(usage: PromoCodeUsage): Promise<void>;
    countPaidUsesByCode(promoCodeId: string, excludeOrderIds?: readonly string[]): Promise<number>;
    countPaidUsesByCodeAndBuyer(promoCodeId: string, buyerId: string, excludeOrderIds?: readonly string[]): Promise<number>;
    sumPaidDiscountByCode(promoCodeId: string, excludeOrderIds?: readonly string[]): Promise<number>;
}
