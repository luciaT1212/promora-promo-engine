import { IPromoCodeUsageRepository } from '../../../domain/interfaces/promo-code-usage.repository';
import { PromoCodeUsage } from '../../../domain/entities/promo-code-usage';

export class InMemoryPromoCodeUsageRepository
  implements IPromoCodeUsageRepository
{
  private readonly store: PromoCodeUsage[] = [];

  async save(usage: PromoCodeUsage): Promise<void> {
    this.store.push(usage);
  }

  async countPaidUsesByCode(
    promoCodeId: string,
    excludeOrderIds: readonly string[] = [],
  ): Promise<number> {
    return this.store.filter(
      (u) =>
        u.promoCodeId === promoCodeId &&
        u.isPaid &&
        !excludeOrderIds.includes(u.orderId),
    ).length;
  }

  async countPaidUsesByCodeAndBuyer(
    promoCodeId: string,
    buyerId: string,
    excludeOrderIds: readonly string[] = [],
  ): Promise<number> {
    return this.store.filter(
      (u) =>
        u.promoCodeId === promoCodeId &&
        u.buyerId === buyerId &&
        u.isPaid &&
        !excludeOrderIds.includes(u.orderId),
    ).length;
  }

  async sumPaidDiscountByCode(
    promoCodeId: string,
    excludeOrderIds: readonly string[] = [],
  ): Promise<number> {
    return this.store
      .filter(
        (u) =>
          u.promoCodeId === promoCodeId &&
          u.isPaid &&
          !excludeOrderIds.includes(u.orderId),
      )
      .reduce((sum, u) => sum + u.discountAmount, 0);
  }

  clear(): void {
    this.store.length = 0;
  }
}
