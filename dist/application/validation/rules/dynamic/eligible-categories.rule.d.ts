import { ValidationRule } from '../validation-rule';
import { ValidationContext } from '../../../../domain/value-objects/validation-context';
import { ValidationResult } from '../../../../domain/value-objects/validation-result';
export declare class EligibleCategoriesRule extends ValidationRule {
    protected validate(context: ValidationContext): Promise<ValidationResult>;
}
