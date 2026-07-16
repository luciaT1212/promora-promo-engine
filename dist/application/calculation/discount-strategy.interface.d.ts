import { PromoCode } from '../../domain/entities/promo-code';
import { OrderableInterface } from '../../domain/interfaces/orderable.interface';
export interface IDiscountStrategy {
    calculate(promo: PromoCode, order: OrderableInterface): number;
    canHandle(type: string): boolean;
}
