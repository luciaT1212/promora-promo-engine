import { IDiscountStrategy } from '../discount-strategy.interface';
import { PromoCode } from '../../../domain/entities/promo-code';
import { OrderableInterface } from '../../../domain/interfaces/orderable.interface';
import { DiscountType } from '../../../domain/entities/promo-code.types';
import { TierConfiguration } from '../../../domain/entities/tier-configuration';
import { Money } from '../../../domain/value-objects/money';

export class TieredDiscountStrategy implements IDiscountStrategy {
  calculate(promo: PromoCode, order: OrderableInterface): number {
    const totalOrders = order.getOrderContext().buyerProfile.totalOrders;
    const eligibleTier = this.findEligibleTier(promo.tiers, totalOrders);
    if (!eligibleTier) return 0;
    return new Money(order.getSubtotal()).multiply(
      eligibleTier.discountPercent / 100,
    ).amount;
  }

  canHandle(type: DiscountType): boolean {
    return type === DiscountType.TIERED;
  }

  private findEligibleTier(
    tiers: readonly TierConfiguration[],
    totalOrders: number,
  ): TierConfiguration | null {
    const eligible = tiers.filter((t) => t.minOrders <= totalOrders);
    if (eligible.length === 0) return null;
    return eligible.reduce((max, t) => (t.minOrders > max.minOrders ? t : max));
  }
}
