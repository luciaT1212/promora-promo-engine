import { ValidationRule } from '../validation-rule';
import { ValidationContext } from '../../../../domain/value-objects/validation-context';
import { ValidationResult } from '../../../../domain/value-objects/validation-result';
import { IPromoCodeRepository } from '../../../../domain/interfaces/promo-code.repository';
export declare class ExistenceRule extends ValidationRule {
    private readonly promoRepo;
    constructor(promoRepo: IPromoCodeRepository);
    protected validate(context: ValidationContext): Promise<ValidationResult>;
}
