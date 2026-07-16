import { IPromoCodeUsageRepository } from '../../../domain/interfaces/promo-code-usage.repository';
import { PromoCodeUsage } from '../../../domain/entities/promo-code-usage';
export declare class InMemoryPromoCodeUsageRepository implements IPromoCodeUsageRepository {
    private readonly store;
    save(usage: PromoCodeUsage): Promise<void>;
    countPaidUsesByCode(promoCodeId: string, excludeOrderIds?: readonly string[]): Promise<number>;
    countPaidUsesByCodeAndBuyer(promoCodeId: string, buyerId: string, excludeOrderIds?: readonly string[]): Promise<number>;
    sumPaidDiscountByCode(promoCodeId: string, excludeOrderIds?: readonly string[]): Promise<number>;
    clear(): void;
}
