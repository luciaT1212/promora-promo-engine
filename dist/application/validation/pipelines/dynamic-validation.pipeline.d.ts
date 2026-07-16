import { ValidationContext } from '../../../domain/value-objects/validation-context';
import { ValidationResult } from '../../../domain/value-objects/validation-result';
import { PromoCode } from '../../../domain/entities/promo-code';
import { ValidationRuleFactory } from '../../factories/validation-rule.factory';
export declare class DynamicValidationPipeline {
    private readonly ruleFactory;
    constructor(ruleFactory: ValidationRuleFactory);
    execute(context: ValidationContext, promo: PromoCode): Promise<ValidationResult>;
    private chain;
}
