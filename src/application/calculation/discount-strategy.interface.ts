import { PromoCode } from '../../domain/entities/promo-code';
import { OrderableInterface } from '../../domain/interfaces/orderable.interface';

/**
 * Contrato de las estrategias de calculo de descuento. ASD - IDiscountStrategy.
 * Cada tipo de descuento implementa esta interfaz.
 */
export interface IDiscountStrategy {
  calculate(promo: PromoCode, order: OrderableInterface): number;
  canHandle(type: string): boolean;
}
