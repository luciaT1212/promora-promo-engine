import { PromoCode } from '../../domain/entities/promo-code';
import { OrderableInterface } from '../../domain/interfaces/orderable.interface';
import { DiscountType } from '../../domain/entities/promo-code.types';

export interface IDiscountStrategy {
  calculate(promo: PromoCode, order: OrderableInterface): number;
  canHandle(type: DiscountType): boolean;
}
