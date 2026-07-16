import { ValidationRule } from '../validation-rule';
import { ValidationContext } from '../../../../domain/value-objects/validation-context';
import { ValidationResult } from '../../../../domain/value-objects/validation-result';
import { IPromoCodeUsageRepository } from '../../../../domain/interfaces/promo-code-usage.repository';
export declare class GlobalUsageLimitRule extends ValidationRule {
    private readonly usageRepo;
    constructor(usageRepo: IPromoCodeUsageRepository);
    protected validate(context: ValidationContext): Promise<ValidationResult>;
}
