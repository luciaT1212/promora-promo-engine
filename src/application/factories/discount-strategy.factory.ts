import { IDiscountStrategy } from '../calculation/discount-strategy.interface';
import { FixedDiscountStrategy } from '../calculation/strategies/fixed-discount.strategy';
import { PercentageDiscountStrategy } from '../calculation/strategies/percentage-discount.strategy';
import { TieredDiscountStrategy } from '../calculation/strategies/tiered-discount.strategy';
import { DiscountType } from '../../domain/entities/promo-code.types';

/**
 * Factory que devuelve la estrategia adecuada para cada tipo de descuento.
 * ASD - "DiscountStrategyFactory". Agregar un nuevo tipo = una nueva rama.
 */
export class DiscountStrategyFactory {
  private readonly strategies: IDiscountStrategy[] = [
    new FixedDiscountStrategy(),
    new PercentageDiscountStrategy(),
    new TieredDiscountStrategy(),
  ];

  getStrategy(type: DiscountType): IDiscountStrategy {
    const strategy = this.strategies.find((s) => s.canHandle(type));
    if (!strategy) {
      throw new Error(`No discount strategy found for type: ${type}`);
    }
    return strategy;
  }
}
