import { ValidationContext } from '../../../domain/value-objects/validation-context';
import { ValidationResult } from '../../../domain/value-objects/validation-result';
import { IPromoCodeRepository } from '../../../domain/interfaces/promo-code.repository';
export declare class MandatoryValidationPipeline {
    private readonly chainHead;
    constructor(promoRepo: IPromoCodeRepository);
    execute(context: ValidationContext): Promise<ValidationResult>;
}
