import { ValidationRule } from '../validation-rule';
import { ValidationContext } from '../../../../domain/value-objects/validation-context';
import { ValidationResult } from '../../../../domain/value-objects/validation-result';
import { ErrorCode } from '../../../../domain/errors/error-codes';
import { RuleType } from '../../../../domain/entities/promo-code.types';
import { IRestrictedUserRepository } from '../../../../domain/interfaces/restricted-user.repository';
import { AuthorizedBuyerSpecification } from '../../../../domain/specifications/authorized-buyer.specification';

export class RestrictedUsageRule extends ValidationRule {
  private readonly specification: AuthorizedBuyerSpecification;
  constructor(restrictedRepo: IRestrictedUserRepository) {
    super();
    this.specification = new AuthorizedBuyerSpecification(restrictedRepo);
  }

  protected async validate(
    context: ValidationContext,
  ): Promise<ValidationResult> {
    const rule = context.promo?.getRule(RuleType.RESTRICTED_USAGE);
    if (!rule) return ValidationResult.success();

    const authorized = await this.specification.isSatisfiedBy({
      promoCodeId: context.promo!.id,
      buyerId: context.buyer.buyerId,
    });

    if (!authorized) {
      return ValidationResult.failure(ErrorCode.RESTRICTED_USAGE);
    }
    return ValidationResult.success();
  }
}
