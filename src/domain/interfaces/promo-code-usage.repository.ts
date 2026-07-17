import { PromoCodeUsage } from '../entities/promo-code-usage';

export interface IPromoCodeUsageRepository {
  runSerializable<T>(
    operation: (repository: IPromoCodeUsageRepository) => Promise<T>,
  ): Promise<T>;
  save(usage: PromoCodeUsage): Promise<void>;
  existsByCodeAndOrder(promoCodeId: string, orderId: string): Promise<boolean>;

  countPaidUsesByCode(
    promoCodeId: string,
    excludeOrderIds?: readonly string[],
  ): Promise<number>;

  countPaidUsesByCodeAndBuyer(
    promoCodeId: string,
    buyerId: string,
    excludeOrderIds?: readonly string[],
  ): Promise<number>;

  sumPaidDiscountByCode(
    promoCodeId: string,
    excludeOrderIds?: readonly string[],
  ): Promise<number>;
}
