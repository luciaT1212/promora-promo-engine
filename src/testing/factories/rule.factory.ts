import { PromoRule } from '../../domain/entities/promo-rule';
import { PostCalcRule } from '../../domain/entities/post-calc-rule';
import {
  RuleType,
  PostCalcRuleType,
} from '../../domain/entities/promo-code.types';

export class RuleFactory {
  static minPurchase(minAmount: number): PromoRule {
    return new PromoRule(RuleType.MIN_PURCHASE_AMOUNT, { minAmount });
  }

  static eligibleCategories(categoryIds: readonly string[]): PromoRule {
    return new PromoRule(RuleType.ELIGIBLE_CATEGORIES, { categoryIds });
  }

  static firstOrderOnly(): PromoRule {
    return new PromoRule(RuleType.FIRST_ORDER_ONLY, {});
  }

  static userUsageLimit(limit: number): PromoRule {
    return new PromoRule(RuleType.USER_USAGE_LIMIT, { limit });
  }

  static globalUsageLimit(limit: number): PromoRule {
    return new PromoRule(RuleType.GLOBAL_USAGE_LIMIT, { limit });
  }

  static globalAmountLimit(maxTotalAmount: number): PromoRule {
    return new PromoRule(RuleType.GLOBAL_AMOUNT_LIMIT, { maxTotalAmount });
  }

  static restrictedUsage(): PromoRule {
    return new PromoRule(RuleType.RESTRICTED_USAGE, {});
  }

  static maxDiscount(maxAmount: number): PostCalcRule {
    return new PostCalcRule(PostCalcRuleType.MAX_DISCOUNT_AMOUNT, { maxAmount });
  }
}
