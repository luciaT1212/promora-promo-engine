import { DiscountType, PromoStateType, RuleType } from './promo-code.types';
import { PromoRule } from './promo-rule';
import { PostCalcRule } from './post-calc-rule';
import { TierConfiguration } from './tier-configuration';
import { PromoState } from '../states/promo-state';
import { PromoStateFactory } from '../states/promo-state.factory';

export class PromoCode {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly type: DiscountType,
    public readonly value: number,
    public readonly state: PromoStateType,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly rules: readonly PromoRule[] = [],
    public readonly postCalcRules: readonly PostCalcRule[] = [],
    public readonly tiers: readonly TierConfiguration[] = [],
    stateFactory: PromoStateFactory = new PromoStateFactory(),
  ) {
    this.stateBehavior = stateFactory.create(state);
  }

  private readonly stateBehavior: PromoState;

  isActive(): boolean {
    return this.stateBehavior.canBeUsed();
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
