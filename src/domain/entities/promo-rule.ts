import { RuleType } from './promo-code.types';

export class PromoRule {
  constructor(
    public readonly ruleType: RuleType,
    public readonly parameters: Record<string, unknown>,
    public readonly isActive: boolean = true,
  ) {}
}
