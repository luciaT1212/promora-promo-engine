import { PromoCode } from '../../domain/entities/promo-code';
import { OrderableInterface } from '../../domain/interfaces/orderable.interface';
import { DiscountStrategyFactory } from '../factories/discount-strategy.factory';
import { MaxDiscountAmountRule } from './post-rules/max-discount-amount.rule';

export interface CalculationResult {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
}

/**
 * Orquesta el calculo del descuento: selecciona estrategia, calcula,
 * y aplica reglas post-calculo. ASD - "DiscountCalculator" / "CalculationEngine".
 */
export class DiscountCalculator {
  constructor(
    private readonly strategyFactory: DiscountStrategyFactory,
    private readonly maxDiscountRule: MaxDiscountAmountRule = new MaxDiscountAmountRule(),
  ) {}

  calculate(promo: PromoCode, order: OrderableInterface): CalculationResult {
    const strategy = this.strategyFactory.getStrategy(promo.type);
    const rawDiscount = strategy.calculate(promo, order);
    const finalDiscount = this.maxDiscountRule.apply(promo, rawDiscount);

    const subtotal = order.getSubtotal();
    return {
      originalAmount: subtotal,
      discountAmount: finalDiscount,
      finalAmount: Math.max(0, subtotal - finalDiscount),
    };
  }
}
