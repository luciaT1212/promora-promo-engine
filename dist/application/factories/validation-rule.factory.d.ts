import { ValidationRule } from '../validation/rules/validation-rule';
import { RuleType } from '../../domain/entities/promo-code.types';
import { IPromoCodeUsageRepository } from '../../domain/interfaces/promo-code-usage.repository';
import { IRestrictedUserRepository } from '../../domain/interfaces/restricted-user.repository';
export declare class ValidationRuleFactory {
    private readonly usageRepo;
    private readonly restrictedRepo;
    constructor(usageRepo: IPromoCodeUsageRepository, restrictedRepo: IRestrictedUserRepository);
    createRule(type: RuleType): ValidationRule;
    createRules(types: readonly RuleType[]): ValidationRule[];
}
