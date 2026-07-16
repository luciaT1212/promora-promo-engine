import { PromoRule } from '../../domain/entities/promo-rule';
import { PostCalcRule } from '../../domain/entities/post-calc-rule';
export declare class RuleFactory {
    static minPurchase(minAmount: number): PromoRule;
    static eligibleCategories(categoryIds: readonly string[]): PromoRule;
    static firstOrderOnly(): PromoRule;
    static userUsageLimit(limit: number): PromoRule;
    static globalUsageLimit(limit: number): PromoRule;
    static globalAmountLimit(maxTotalAmount: number): PromoRule;
    static restrictedUsage(): PromoRule;
    static maxDiscount(maxAmount: number): PostCalcRule;
}
