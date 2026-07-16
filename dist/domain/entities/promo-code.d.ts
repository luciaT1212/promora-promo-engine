import { DiscountType, PromoState, RuleType } from './promo-code.types';
import { PromoRule } from './promo-rule';
import { PostCalcRule } from './post-calc-rule';
import { TierConfiguration } from './tier-configuration';
export declare class PromoCode {
    readonly id: string;
    readonly code: string;
    readonly type: DiscountType;
    readonly value: number;
    readonly state: PromoState;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly rules: readonly PromoRule[];
    readonly postCalcRules: readonly PostCalcRule[];
    readonly tiers: readonly TierConfiguration[];
    constructor(id: string, code: string, type: DiscountType, value: number, state: PromoState, startDate: Date, endDate: Date, rules?: readonly PromoRule[], postCalcRules?: readonly PostCalcRule[], tiers?: readonly TierConfiguration[]);
    isActive(): boolean;
    isExpired(now?: Date): boolean;
    getRule(ruleType: RuleType): PromoRule | undefined;
    hasRule(ruleType: RuleType): boolean;
    getActiveRules(): readonly PromoRule[];
}
