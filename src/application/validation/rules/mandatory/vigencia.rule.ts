import { ValidationRule } from '../validation-rule';
import { ValidationContext } from '../../../../domain/value-objects/validation-context';
import { ValidationResult } from '../../../../domain/value-objects/validation-result';
import { ErrorCode } from '../../../../domain/errors/error-codes';
import { Clock, SystemClock } from '../../../../domain/interfaces/clock';

export class VigenciaRule extends ValidationRule {
  constructor(private readonly clock: Clock = new SystemClock()) {
    super();
  }
  protected async validate(
    context: ValidationContext,
  ): Promise<ValidationResult> {
    if (!context.promo) {
      return ValidationResult.failure(ErrorCode.INVALID_CODE);
    }
    if (context.promo.isExpired(this.clock.now())) {
      return ValidationResult.failure(ErrorCode.EXPIRED_COUPON);
    }
    return ValidationResult.success();
  }
}
