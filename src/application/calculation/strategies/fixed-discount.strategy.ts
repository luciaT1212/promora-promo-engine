import { IDiscountStrategy } from '../discount-strategy.interface';
import { PromoCode } from '../../../domain/entities/promo-code';
import { OrderableInterface } from '../../../domain/interfaces/orderable.interface';
import { DiscountType } from '../../../domain/entities/promo-code.types';
import { Money } from '../../../domain/value-objects/money';

export class FixedDiscountStrategy implements IDiscountStrategy {
  calculate(promo: PromoCode, order: OrderableInterface): number {
    const subtotal = new Money(order.getSubtotal());
    const value = new Money(promo.value);
    return Money.min(value, subtotal).amount;
  }

  canHandle(type: DiscountType): boolean {
    return type === DiscountType.FIXED;
  }
}
