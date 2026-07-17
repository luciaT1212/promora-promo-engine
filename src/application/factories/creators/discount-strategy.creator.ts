import { IDiscountStrategy } from '../../calculation/discount-strategy.interface';

export interface DiscountStrategyCreator {
  create(): IDiscountStrategy;
}

export class RegisteredDiscountStrategyCreator implements DiscountStrategyCreator {
  constructor(private readonly factoryMethod: () => IDiscountStrategy) {}
  create(): IDiscountStrategy {
    return this.factoryMethod();
  }
}
