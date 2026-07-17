import { ValidationRule } from '../../validation/rules/validation-rule';

export interface ValidationRuleCreator {
  create(): ValidationRule;
}

export class RegisteredValidationRuleCreator implements ValidationRuleCreator {
  constructor(private readonly factoryMethod: () => ValidationRule) {}
  create(): ValidationRule {
    return this.factoryMethod();
  }
}
