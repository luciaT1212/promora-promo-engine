import { IDiscountStrategy } from '../discount-strategy.interface';
import { PromoCode } from '../../../domain/entities/promo-code';
import { OrderableInterface } from '../../../domain/interfaces/orderable.interface';
import { DiscountType } from '../../../domain/entities/promo-code.types';
import { Money } from '../../../domain/value-objects/money';

export class PercentDiscountStrategy implements IDiscountStrategy {
  calculate(promo: PromoCode, order: OrderableInterface): number {
    return new Money(order.getSubtotal()).multiply(promo.value / 100).amount;
  }
  canHandle(type: DiscountType): boolean {
    return type === DiscountType.PERCENT;
  }
}
