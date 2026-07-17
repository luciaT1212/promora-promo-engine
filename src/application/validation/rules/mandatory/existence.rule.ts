import { ValidationRule } from '../validation-rule';
import { ValidationContext } from '../../../../domain/value-objects/validation-context';
import { ValidationResult } from '../../../../domain/value-objects/validation-result';
import { ErrorCode } from '../../../../domain/errors/error-codes';
import { IPromoCodeRepository } from '../../../../domain/interfaces/promo-code.repository';

export class ExistenceRule extends ValidationRule {
  constructor(private readonly promoRepo: IPromoCodeRepository) {
    super();
  }

  protected async validate(
    context: ValidationContext,
  ): Promise<ValidationResult> {
    const code =
      typeof context.promoCodeString === 'string'
        ? context.promoCodeString.trim()
        : '';
    if (!code) return ValidationResult.failure(ErrorCode.INVALID_CODE);
    const promo = await this.promoRepo.findByCode(code);
    if (!promo) {
      return ValidationResult.failure(ErrorCode.INVALID_CODE);
    }
    context.promo = promo;
    return ValidationResult.success();
  }
}
