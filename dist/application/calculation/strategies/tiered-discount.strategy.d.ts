import { IDiscountStrategy } from '../discount-strategy.interface';
import { PromoCode } from '../../../domain/entities/promo-code';
import { OrderableInterface } from '../../../domain/interfaces/orderable.interface';
export declare class TieredDiscountStrategy implements IDiscountStrategy {
    calculate(promo: PromoCode, order: OrderableInterface): number;
    canHandle(type: string): boolean;
    private findEligibleTier;
    private round;
}
