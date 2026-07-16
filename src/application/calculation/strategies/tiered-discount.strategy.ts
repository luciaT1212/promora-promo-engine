import { IDiscountStrategy } from '../discount-strategy.interface';
import { PromoCode } from '../../../domain/entities/promo-code';
import { OrderableInterface } from '../../../domain/interfaces/orderable.interface';
import { DiscountType } from '../../../domain/entities/promo-code.types';
import { TierConfiguration } from '../../../domain/entities/tier-configuration';

/**
 * Estrategia de descuento por tramos. TDR seccion 6.
 * Busca el tramo mas alto donde minOrders <= totalOrders del comprador,
 * y aplica su porcentaje sobre el subtotal.
 */
export class TieredDiscountStrategy implements IDiscountStrategy {
  calculate(promo: PromoCode, order: OrderableInterface): number {
    const totalOrders = order.getOrderContext().buyerProfile.totalOrders;
    const eligibleTier = this.findEligibleTier(promo.tiers, totalOrders);
    if (!eligibleTier) return 0;
    return this.round(
      order.getSubtotal() * (eligibleTier.discountPercent / 100),
    );
  }

  canHandle(type: string): boolean {
    return type === DiscountType.TIERED;
  }

  private findEligibleTier(
    tiers: readonly TierConfiguration[],
    totalOrders: number,
  ): TierConfiguration | null {
    const eligible = tiers.filter((t) => t.minOrders <= totalOrders);
    if (eligible.length === 0) return null;
    return eligible.reduce((max, t) =>
      t.minOrders > max.minOrders ? t : max,
    );
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
