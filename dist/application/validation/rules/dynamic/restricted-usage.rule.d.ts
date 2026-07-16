import { ValidationRule } from '../validation-rule';
import { ValidationContext } from '../../../../domain/value-objects/validation-context';
import { ValidationResult } from '../../../../domain/value-objects/validation-result';
import { IRestrictedUserRepository } from '../../../../domain/interfaces/restricted-user.repository';
export declare class RestrictedUsageRule extends ValidationRule {
    private readonly restrictedRepo;
    constructor(restrictedRepo: IRestrictedUserRepository);
    protected validate(context: ValidationContext): Promise<ValidationResult>;
}
