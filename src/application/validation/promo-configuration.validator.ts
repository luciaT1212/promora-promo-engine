import { PromoCode } from '../../domain/entities/promo-code';
import {
  DiscountType,
  PostCalcRuleType,
  RuleType,
} from '../../domain/entities/promo-code.types';
import { ErrorCode } from '../../domain/errors/error-codes';
import { ValidationResult } from '../../domain/value-objects/validation-result';

export class PromoConfigurationValidator {
  validate(promo: PromoCode): ValidationResult {
    if (
      !(promo.startDate instanceof Date) ||
      !(promo.endDate instanceof Date) ||
      Number.isNaN(promo.startDate.getTime()) ||
      Number.isNaN(promo.endDate.getTime()) ||
      promo.startDate > promo.endDate
    )
      return this.invalid();
    if (
      !Object.values(DiscountType).includes(promo.type) ||
      !Number.isFinite(promo.value)
    )
      return this.invalid();
    if (promo.type === DiscountType.FIXED && promo.value < 0)
      return this.invalid();
    if (
      promo.type === DiscountType.PERCENT &&
      (promo.value < 0 || promo.value > 100)
    )
      return this.invalid();
    if (
      promo.type === DiscountType.TIERED &&
      (promo.tiers.length === 0 ||
        promo.tiers.some(
          (t) =>
            !Number.isInteger(t.minOrders) ||
            t.minOrders < 0 ||
            !Number.isFinite(t.discountPercent) ||
            t.discountPercent < 0 ||
            t.discountPercent > 100,
        ))
    )
      return this.invalid();
    for (const rule of promo.rules.filter((r) => r.isActive)) {
      if (!Object.values(RuleType).includes(rule.ruleType))
        return this.invalid();
      const p = rule.parameters;
      if (
        (rule.ruleType === RuleType.MIN_PURCHASE_AMOUNT &&
          !this.nonNegative(p.minAmount)) ||
        ((rule.ruleType === RuleType.USER_USAGE_LIMIT ||
          rule.ruleType === RuleType.GLOBAL_USAGE_LIMIT) &&
          !this.positiveInteger(p.limit)) ||
        (rule.ruleType === RuleType.GLOBAL_AMOUNT_LIMIT &&
          !this.nonNegative(p.maxTotalAmount)) ||
        (rule.ruleType === RuleType.ELIGIBLE_CATEGORIES &&
          (!Array.isArray(p.categoryIds) ||
            p.categoryIds.length === 0 ||
            p.categoryIds.some((x) => typeof x !== 'string' || !x.trim())))
      )
        return this.invalid();
    }
    for (const rule of promo.postCalcRules.filter((r) => r.isActive)) {
      if (
        rule.ruleType !== PostCalcRuleType.MAX_DISCOUNT_AMOUNT ||
        !this.nonNegative(rule.parameters.maxAmount)
      )
        return this.invalid();
    }
    return ValidationResult.success();
  }
  private nonNegative(value: unknown): boolean {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0;
  }
  private positiveInteger(value: unknown): boolean {
    return typeof value === 'number' && Number.isInteger(value) && value > 0;
  }
  private invalid(): ValidationResult {
    return ValidationResult.failure(ErrorCode.INVALID_CONFIGURATION);
  }
}
