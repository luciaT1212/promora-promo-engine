import { IDiscountStrategy } from '../discount-strategy.interface';
import { PromoCode } from '../../../domain/entities/promo-code';
import { OrderableInterface } from '../../../domain/interfaces/orderable.interface';
import { DiscountType } from '../../../domain/entities/promo-code.types';

/**
 * Estrategia de descuento fijo. TDR seccion 6.
 * Formula: min(value, subtotal). Nunca descuenta mas que el subtotal.
 */
export class FixedDiscountStrategy implements IDiscountStrategy {
  calculate(promo: PromoCode, order: OrderableInterface): number {
    return Math.min(promo.value, order.getSubtotal());
  }

  canHandle(type: string): boolean {
    return type === DiscountType.FIXED;
  }
}
