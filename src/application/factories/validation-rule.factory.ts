import { ValidationRule } from '../validation/rules/validation-rule';
import { MinPurchaseAmountRule } from '../validation/rules/dynamic/min-purchase-amount.rule';
import { EligibleCategoriesRule } from '../validation/rules/dynamic/eligible-categories.rule';
import { FirstOrderOnlyRule } from '../validation/rules/dynamic/first-order-only.rule';
import { UserUsageLimitRule } from '../validation/rules/dynamic/user-usage-limit.rule';
import { GlobalUsageLimitRule } from '../validation/rules/dynamic/global-usage-limit.rule';
import { GlobalAmountLimitRule } from '../validation/rules/dynamic/global-amount-limit.rule';
import { RestrictedUsageRule } from '../validation/rules/dynamic/restricted-usage.rule';
import { RuleType } from '../../domain/entities/promo-code.types';
import { IPromoCodeUsageRepository } from '../../domain/interfaces/promo-code-usage.repository';
import { IRestrictedUserRepository } from '../../domain/interfaces/restricted-user.repository';
import { IOrderRepository } from '../../domain/interfaces/order.repository';
import { ICategoryHierarchyRepository } from '../../domain/interfaces/category-hierarchy.repository';
import {
  RegisteredValidationRuleCreator,
  ValidationRuleCreator,
} from './creators/validation-rule.creator';

export class ValidationRuleFactory {
  private readonly creators = new Map<RuleType, ValidationRuleCreator>();
  constructor(
    private readonly usageRepo: IPromoCodeUsageRepository,
    private readonly restrictedRepo: IRestrictedUserRepository,
    private readonly orderRepo?: IOrderRepository,
    private readonly categoryRepo?: ICategoryHierarchyRepository,
  ) {
    this.register(
      RuleType.MIN_PURCHASE_AMOUNT,
      new RegisteredValidationRuleCreator(() => new MinPurchaseAmountRule()),
    );
    this.register(
      RuleType.ELIGIBLE_CATEGORIES,
      new RegisteredValidationRuleCreator(
        () => new EligibleCategoriesRule(this.categoryRepo),
      ),
    );
    this.register(
      RuleType.FIRST_ORDER_ONLY,
      new RegisteredValidationRuleCreator(
        () => new FirstOrderOnlyRule(this.orderRepo),
      ),
    );
    this.register(
      RuleType.USER_USAGE_LIMIT,
      new RegisteredValidationRuleCreator(
        () => new UserUsageLimitRule(this.usageRepo),
      ),
    );
    this.register(
      RuleType.GLOBAL_USAGE_LIMIT,
      new RegisteredValidationRuleCreator(
        () => new GlobalUsageLimitRule(this.usageRepo),
      ),
    );
    this.register(
      RuleType.GLOBAL_AMOUNT_LIMIT,
      new RegisteredValidationRuleCreator(
        () => new GlobalAmountLimitRule(this.usageRepo),
      ),
    );
    this.register(
      RuleType.RESTRICTED_USAGE,
      new RegisteredValidationRuleCreator(
        () => new RestrictedUsageRule(this.restrictedRepo),
      ),
    );
  }

  register(type: RuleType, creator: ValidationRuleCreator): void {
    this.creators.set(type, creator);
  }

  createRule(type: RuleType): ValidationRule {
    const creator = this.creators.get(type);
    if (!creator) throw new Error(`Tipo de regla desconocido: ${String(type)}`);
    return creator.create();
  }

  createRules(types: readonly RuleType[]): ValidationRule[] {
    return types.map((t) => this.createRule(t));
  }
}
