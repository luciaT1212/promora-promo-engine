import { IDiscountStrategy } from '../calculation/discount-strategy.interface';
import { DiscountType } from '../../domain/entities/promo-code.types';
export declare class DiscountStrategyFactory {
    private readonly strategies;
    getStrategy(type: DiscountType): IDiscountStrategy;
}
