import { IPromoCodeUsageRepository } from '../../../domain/interfaces/promo-code-usage.repository';
import { PromoCodeUsage } from '../../../domain/entities/promo-code-usage';
import { DuplicatePromoUsageError } from '../../../domain/errors/duplicate-promo-usage.error';

export class InMemoryPromoCodeUsageRepository implements IPromoCodeUsageRepository {
  private readonly store: PromoCodeUsage[] = [];

  runSerializable<T>(
    operation: (repository: IPromoCodeUsageRepository) => Promise<T>,
  ): Promise<T> {
    return operation(this);
  }

  async save(usage: PromoCodeUsage): Promise<void> {
    if (await this.existsByCodeAndOrder(usage.promoCodeId, usage.orderId)) {
      throw new DuplicatePromoUsageError();
    }
    this.store.push(usage);
  }

  async existsByCodeAndOrder(
    promoCodeId: string,
    orderId: string,
  ): Promise<boolean> {
    return this.store.some(
      (u) => u.promoCodeId === promoCodeId && u.orderId === orderId,
    );
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
