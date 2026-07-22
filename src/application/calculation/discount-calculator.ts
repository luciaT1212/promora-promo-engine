import { Injectable } from '@nestjs/common';
import { IDiscountStrategy } from './discount-strategy.interface';
import { CalculationResult } from '../../domain/value-objects/calculation-result';
import { PromoCode } from '../../domain/entities/promo-code';
import { OrderableInterface } from '../../domain/interfaces/orderable.interface';
import { DiscountStrategyFactory } from '../factories/discount-strategy.factory';
import { MaxDiscountAmountRule } from './post-rules/max-discount-amount.rule';

@Injectable()
export class DiscountCalculator {
  private strategyFactory: DiscountStrategyFactory;
  private maxDiscountRule: MaxDiscountAmountRule;

  constructor(
    strategies: IDiscountStrategy[] | DiscountStrategyFactory,
    maxDiscountRule: MaxDiscountAmountRule = new MaxDiscountAmountRule(),
  ) {
    if (Array.isArray(strategies)) {
      this.strategyFactory = DiscountStrategyFactory.fromList(strategies);
    } else {
      this.strategyFactory = strategies;
    }
    this.maxDiscountRule = maxDiscountRule;
  }

  calculate(
    promoCode: PromoCode,
    order: OrderableInterface,
  ): CalculationResult {
    const strategy = this.selectStrategy(promoCode.type);

    if (!strategy) {
      throw new Error(`No strategy found for type: ${promoCode.type}`);
    }

    const subtotal = order.getSubtotal();
    if (subtotal < 0) {
      throw new Error(`Subtotal negativo inválido: ${subtotal}`);
    }

    let discountAmount = strategy.calculate(promoCode, order);
    discountAmount = this.maxDiscountRule.apply(promoCode, discountAmount);

    if (discountAmount < 0) {
      throw new Error(`Descuento negativo inválido: ${discountAmount}`);
    }

    return new CalculationResult(discountAmount, promoCode.type, subtotal);
  }

  private selectStrategy(type: any): IDiscountStrategy | undefined {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return this.strategyFactory.getStrategy(type);
    } catch {
      return undefined;
    }
  }
}

export { CalculationResult };
