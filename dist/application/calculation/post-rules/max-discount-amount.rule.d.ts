import { PromoCode } from '../../../domain/entities/promo-code';
export declare class MaxDiscountAmountRule {
    apply(promo: PromoCode, discount: number): number;
}
