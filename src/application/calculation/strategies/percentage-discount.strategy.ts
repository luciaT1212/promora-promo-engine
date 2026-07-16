import { IDiscountStrategy } from '../discount-strategy.interface';
import { PromoCode } from '../../../domain/entities/promo-code';
import { OrderableInterface } from '../../../domain/interfaces/orderable.interface';
import { DiscountType } from '../../../domain/entities/promo-code.types';

/**
 * Estrategia de descuento porcentual. TDR seccion 6.
 * Formula: subtotal * (value / 100).
 */
export class PercentageDiscountStrategy implements IDiscountStrategy {
  calculate(promo: PromoCode, order: OrderableInterface): number {
    return this.round(order.getSubtotal() * (promo.value / 100));
  }

  canHandle(type: string): boolean {
    return type === DiscountType.PERCENT;
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
