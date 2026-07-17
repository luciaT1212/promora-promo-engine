import { PromoCode } from '../../../domain/entities/promo-code';
import { PostCalcRuleType } from '../../../domain/entities/promo-code.types';

export class MaxDiscountAmountRule {
  apply(promo: PromoCode, discount: number): number {
    const rule = promo.postCalcRules.find(
      (r) => r.ruleType === PostCalcRuleType.MAX_DISCOUNT_AMOUNT && r.isActive,
    );
    if (!rule) return discount;

    const maxAmount = Number(rule.parameters.maxAmount ?? 0);
    return Math.min(discount, maxAmount);
  }
}
