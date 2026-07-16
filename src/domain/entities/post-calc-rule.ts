import { PostCalcRuleType } from './promo-code.types';

export class PostCalcRule {
  constructor(
    public readonly ruleType: PostCalcRuleType,
    public readonly parameters: Record<string, unknown>,
    public readonly isActive: boolean = true,
  ) {}
}
