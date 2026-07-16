import { DiscountType, PromoState, RuleType } from './promo-code.types';
import { PromoRule } from './promo-rule';
import { PostCalcRule } from './post-calc-rule';
import { TierConfiguration } from './tier-configuration';

export class PromoCode {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly type: DiscountType,
    public readonly value: number,
    public readonly state: PromoState,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly rules: readonly PromoRule[] = [],
    public readonly postCalcRules: readonly PostCalcRule[] = [],
    public readonly tiers: readonly TierConfiguration[] = [],
  ) {}

  isActive(): boolean {
    return this.state === PromoState.ACTIVE;
  }

  isExpired(now: Date = new Date()): boolean {
    return now < this.startDate || now > this.endDate;
  }

  getRule(ruleType: RuleType): PromoRule | undefined {
    return this.rules.find((r) => r.ruleType === ruleType && r.isActive);
  }

  hasRule(ruleType: RuleType): boolean {
    return this.getRule(ruleType) !== undefined;
  }

  getActiveRules(): readonly PromoRule[] {
    return this.rules.filter((r) => r.isActive);
  }
}
