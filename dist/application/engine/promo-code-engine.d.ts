import { ValidationEngine } from './validation-engine';
import { DiscountCalculator, CalculationResult } from '../calculation/discount-calculator';
import { ValidationResult } from '../../domain/value-objects/validation-result';
import { OrderableInterface } from '../../domain/interfaces/orderable.interface';
import { BuyerProfile } from '../../domain/entities/buyer-profile';
import { IPromoCodeUsageRepository } from '../../domain/interfaces/promo-code-usage.repository';
export interface PromoCodeResult {
    validation: ValidationResult;
    calculation: CalculationResult | null;
}
export declare class PromoCodeEngine {
    private readonly validationEngine;
    private readonly discountCalculator;
    private readonly usageRepo;
    constructor(validationEngine: ValidationEngine, discountCalculator: DiscountCalculator, usageRepo: IPromoCodeUsageRepository);
    validate(promoCodeString: string, order: OrderableInterface, buyer: BuyerProfile): Promise<ValidationResult>;
    validateAndCalculate(promoCodeString: string, order: OrderableInterface, buyer: BuyerProfile): Promise<PromoCodeResult>;
    validateAndApply(promoCodeString: string, orderId: string, order: OrderableInterface, buyer: BuyerProfile): Promise<PromoCodeResult>;
}
