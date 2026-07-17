import { PromoCode } from '../../domain/entities/promo-code';
import { OrderableInterface } from '../../domain/interfaces/orderable.interface';
import { DiscountStrategyFactory } from '../factories/discount-strategy.factory';
import { MaxDiscountAmountRule } from './post-rules/max-discount-amount.rule';
import { Money } from '../../domain/value-objects/money';

export interface CalculationResult {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
}

export class DiscountCalculator {
  constructor(
    private readonly strategyFactory: DiscountStrategyFactory,
    private readonly maxDiscountRule: MaxDiscountAmountRule = new MaxDiscountAmountRule(),
  ) {}

  calculate(promo: PromoCode, order: OrderableInterface): CalculationResult {
    const strategy = this.strategyFactory.getStrategy(promo.type);
    const subtotalMoney = new Money(order.getSubtotal());
    const rawDiscount = new Money(strategy.calculate(promo, order));
    const cappedDiscount = new Money(
      this.maxDiscountRule.apply(promo, rawDiscount.amount),
    );
    const finalDiscount = Money.min(cappedDiscount, subtotalMoney).amount;
    const subtotal = subtotalMoney.amount;
    return {
      originalAmount: subtotal,
      discountAmount: finalDiscount,
      finalAmount: subtotalMoney.subtract(new Money(finalDiscount)).amount,
    };
  }
}
