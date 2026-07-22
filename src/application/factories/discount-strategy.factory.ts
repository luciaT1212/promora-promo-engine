import { IDiscountStrategy } from '../calculation/discount-strategy.interface';
import { FixedDiscountStrategy } from '../calculation/strategies/fixed-discount.strategy';
import { PercentDiscountStrategy } from '../calculation/strategies/percent-discount.strategy';
import { TieredDiscountStrategy } from '../calculation/strategies/tiered-discount.strategy';
import { DiscountType } from '../../domain/entities/promo-code.types';
import {
  DiscountStrategyCreator,
  RegisteredDiscountStrategyCreator,
} from './creators/discount-strategy.creator';

export class DiscountStrategyFactory {
  private readonly creators = new Map<DiscountType, DiscountStrategyCreator>();

  constructor() {
    this.register(
      DiscountType.FIXED,
      new RegisteredDiscountStrategyCreator(() => new FixedDiscountStrategy()),
    );
    this.register(
      DiscountType.PERCENT,
      new RegisteredDiscountStrategyCreator(
        () => new PercentDiscountStrategy(),
      ),
    );
    this.register(
      DiscountType.TIERED,
      new RegisteredDiscountStrategyCreator(() => new TieredDiscountStrategy()),
    );
  }

  register(type: DiscountType, creator: DiscountStrategyCreator): void {
    this.creators.set(type, creator);
  }

  getStrategy(type: DiscountType): IDiscountStrategy {
    const creator = this.creators.get(type);
    if (!creator) {
      throw new Error(
        `No existe una estrategia de descuento para el tipo: ${type}`,
      );
    }
    const strategy: IDiscountStrategy = creator.create();
    return strategy;
  }

  static fromList(strategies: IDiscountStrategy[]): DiscountStrategyFactory {
    const factory = new DiscountStrategyFactory();
    const emptyFactory = new DiscountStrategyFactory();
    emptyFactory.creators.clear();

    for (const strategy of strategies) {
      for (const type of Object.values(DiscountType)) {
        if (strategy.canHandle(type)) {
          emptyFactory.register(
            type,
            new RegisteredDiscountStrategyCreator(() => strategy),
          );
        }
      }
    }

    return emptyFactory;
  }
}
