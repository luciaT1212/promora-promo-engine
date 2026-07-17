import { DiscountType, RuleType } from '../../domain/entities/promo-code.types';
import { InMemoryPromoCodeUsageRepository } from '../../infrastructure/repositories/in-memory/in-memory-usage.repository';
import { InMemoryRestrictedUserRepository } from '../../infrastructure/repositories/in-memory/in-memory-restricted-user.repository';
import { FixedDiscountStrategy } from '../calculation/strategies/fixed-discount.strategy';
import { RegisteredDiscountStrategyCreator } from './creators/discount-strategy.creator';
import { RegisteredValidationRuleCreator } from './creators/validation-rule.creator';
import { DiscountStrategyFactory } from './discount-strategy.factory';
import { ValidationRuleFactory } from './validation-rule.factory';
import { MinPurchaseAmountRule } from '../validation/rules/dynamic/min-purchase-amount.rule';

describe('Factory Method registrable', () => {
  it('permite reemplazar creadores sin modificar el motor', () => {
    const strategies = new DiscountStrategyFactory();
    strategies.register(
      DiscountType.FIXED,
      new RegisteredDiscountStrategyCreator(() => new FixedDiscountStrategy()),
    );
    expect(strategies.getStrategy(DiscountType.FIXED)).toBeInstanceOf(
      FixedDiscountStrategy,
    );
    const rules = new ValidationRuleFactory(
      new InMemoryPromoCodeUsageRepository(),
      new InMemoryRestrictedUserRepository(),
    );
    rules.register(
      RuleType.MIN_PURCHASE_AMOUNT,
      new RegisteredValidationRuleCreator(() => new MinPurchaseAmountRule()),
    );
    expect(rules.createRule(RuleType.MIN_PURCHASE_AMOUNT)).toBeInstanceOf(
      MinPurchaseAmountRule,
    );
  });
});
