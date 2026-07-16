import { RuleType } from './promo-code.types';
export declare class PromoRule {
    readonly ruleType: RuleType;
    readonly parameters: Record<string, unknown>;
    readonly isActive: boolean;
    constructor(ruleType: RuleType, parameters: Record<string, unknown>, isActive?: boolean);
}
