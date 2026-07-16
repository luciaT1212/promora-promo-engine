import { ValidationContext } from '../../../domain/value-objects/validation-context';
import { ValidationResult } from '../../../domain/value-objects/validation-result';
export declare abstract class ValidationRule {
    protected next: ValidationRule | null;
    setNext(rule: ValidationRule): ValidationRule;
    handle(context: ValidationContext): Promise<ValidationResult>;
    protected abstract validate(context: ValidationContext): Promise<ValidationResult>;
}
