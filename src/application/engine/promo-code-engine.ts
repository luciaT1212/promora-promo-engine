import { v4 as uuid } from 'uuid';
import { ValidationEngine } from './validation-engine';
import { DiscountCalculator, CalculationResult } from '../calculation/discount-calculator';
import { ValidationContext } from '../../domain/value-objects/validation-context';
import { ValidationResult } from '../../domain/value-objects/validation-result';
import { OrderableInterface } from '../../domain/interfaces/orderable.interface';
import { BuyerProfile } from '../../domain/entities/buyer-profile';
import { PromoCodeUsage } from '../../domain/entities/promo-code-usage';
import { IPromoCodeUsageRepository } from '../../domain/interfaces/promo-code-usage.repository';

/**
 * Resultado agregado del motor: validacion + calculo.
 */
export interface PromoCodeResult {
  validation: ValidationResult;
  calculation: CalculationResult | null;
}

/**
 * Orquestador central del motor de codigos promocionales.
 * ASD - "PromoCodeEngine". Coordina el flujo completo:
 *   validar -> calcular -> registrar uso.
 * NO contiene logica de reglas ni de calculo (delega en las capas).
 */
export class PromoCodeEngine {
  constructor(
    private readonly validationEngine: ValidationEngine,
    private readonly discountCalculator: DiscountCalculator,
    private readonly usageRepo: IPromoCodeUsageRepository,
  ) {}

  /**
   * Solo valida. No calcula ni registra uso.
   */
  async validate(
    promoCodeString: string,
    order: OrderableInterface,
    buyer: BuyerProfile,
  ): Promise<ValidationResult> {
    const context = new ValidationContext(promoCodeString, order, buyer);
    return this.validationEngine.validate(context);
  }

  /**
   * Valida y calcula el descuento. No registra uso.
   * Util para pre-visualizar el descuento antes de confirmar la orden.
   */
  async validateAndCalculate(
    promoCodeString: string,
    order: OrderableInterface,
    buyer: BuyerProfile,
  ): Promise<PromoCodeResult> {
    const context = new ValidationContext(promoCodeString, order, buyer);
    const validation = await this.validationEngine.validate(context);

    if (!validation.isValid || !context.promo) {
      return { validation, calculation: null };
    }

    const calculation = this.discountCalculator.calculate(context.promo, order);
    return { validation, calculation };
  }

  /**
   * Flujo completo: valida, calcula, y registra el uso.
   * El uso queda con isPaid=false (recien al pagar la orden se marca true).
   */
  async validateAndApply(
    promoCodeString: string,
    orderId: string,
    order: OrderableInterface,
    buyer: BuyerProfile,
  ): Promise<PromoCodeResult> {
    const result = await this.validateAndCalculate(promoCodeString, order, buyer);
    if (!result.validation.isValid || !result.calculation) return result;

    const context = new ValidationContext(promoCodeString, order, buyer);
    await this.validationEngine.validate(context);

    const usage = new PromoCodeUsage(
      uuid(),
      context.promo!.id,
      orderId,
      buyer.buyerId,
      result.calculation.discountAmount,
      false,
    );
    await this.usageRepo.save(usage);

    return result;
  }
}
