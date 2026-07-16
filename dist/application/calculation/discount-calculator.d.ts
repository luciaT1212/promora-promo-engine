import { PromoCode } from '../../domain/entities/promo-code';
import { OrderableInterface } from '../../domain/interfaces/orderable.interface';
import { DiscountStrategyFactory } from '../factories/discount-strategy.factory';
import { MaxDiscountAmountRule } from './post-rules/max-discount-amount.rule';
export interface CalculationResult {
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
}
export declare class DiscountCalculator {
    private readonly strategyFactory;
    private readonly maxDiscountRule;
    constructor(strategyFactory: DiscountStrategyFactory, maxDiscountRule?: MaxDiscountAmountRule);
    calculate(promo: PromoCode, order: OrderableInterface): CalculationResult;
}
