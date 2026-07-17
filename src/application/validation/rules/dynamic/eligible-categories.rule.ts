import { ValidationRule } from '../validation-rule';
import { ValidationContext } from '../../../../domain/value-objects/validation-context';
import { ValidationResult } from '../../../../domain/value-objects/validation-result';
import { ErrorCode } from '../../../../domain/errors/error-codes';
import { RuleType } from '../../../../domain/entities/promo-code.types';
import { ICategoryHierarchyRepository } from '../../../../domain/interfaces/category-hierarchy.repository';
import { EligibleCategorySpecification } from '../../../../domain/specifications/eligible-category.specification';

export class EligibleCategoriesRule extends ValidationRule {
  private readonly specification: EligibleCategorySpecification;
  constructor(hierarchy?: ICategoryHierarchyRepository) {
    super();
    this.specification = new EligibleCategorySpecification(hierarchy);
  }
  protected async validate(
    context: ValidationContext,
  ): Promise<ValidationResult> {
    const rule = context.promo?.getRule(RuleType.ELIGIBLE_CATEGORIES);
    if (!rule) return ValidationResult.success();

    const categoryIds = (rule.parameters.categoryIds as string[]) ?? [];
    const orderCategory = context.order.getOrderContext().categoryId;

    const eligible = await this.specification.isSatisfiedBy({
      categoryId: orderCategory,
      eligibleCategoryIds: categoryIds,
    });
    if (!eligible) {
      return ValidationResult.failure(ErrorCode.INVALID_CODE);
    }
    return ValidationResult.success();
  }
}
