import { PromoCode } from '../../domain/entities/promo-code';
import { DiscountType, PromoState } from '../../domain/entities/promo-code.types';
import { PromoRule } from '../../domain/entities/promo-rule';
import { PostCalcRule } from '../../domain/entities/post-calc-rule';
import { TierConfiguration } from '../../domain/entities/tier-configuration';
export interface PromoCodeFactoryOverrides {
    id?: string;
    code?: string;
    type?: DiscountType;
    value?: number;
    state?: PromoState;
    startDate?: Date;
    endDate?: Date;
    rules?: readonly PromoRule[];
    postCalcRules?: readonly PostCalcRule[];
    tiers?: readonly TierConfiguration[];
}
export declare class PromoCodeFactory {
    static create(overrides?: PromoCodeFactoryOverrides): PromoCode;
    static fixed(value: number, over?: PromoCodeFactoryOverrides): PromoCode;
    static percent(value: number, over?: PromoCodeFactoryOverrides): PromoCode;
    static tiered(tiers: readonly TierConfiguration[], over?: PromoCodeFactoryOverrides): PromoCode;
    static draft(over?: PromoCodeFactoryOverrides): PromoCode;
    static paused(over?: PromoCodeFactoryOverrides): PromoCode;
    static expiredByDate(over?: PromoCodeFactoryOverrides): PromoCode;
    static notYetActive(over?: PromoCodeFactoryOverrides): PromoCode;
}
