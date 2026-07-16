import { PostCalcRuleType } from './promo-code.types';
export declare class PostCalcRule {
    readonly ruleType: PostCalcRuleType;
    readonly parameters: Record<string, unknown>;
    readonly isActive: boolean;
    constructor(ruleType: PostCalcRuleType, parameters: Record<string, unknown>, isActive?: boolean);
}
