import { Injectable } from '@nestjs/common';
import { IDiscountStrategy } from '../discount-strategy.interface';
import { DiscountType } from '../../../domain/entities/promo-code.entity';

@Injectable()
export class FixedDiscountStrategy implements IDiscountStrategy {
  calculate(value: number, subtotal: number): number {
    if (value < 0) {
      throw new Error(`Descuento negativo inválido: ${value}`);
    }
    return Math.min(value, subtotal);
  }

  canHandle(type: DiscountType): boolean {
    return type === DiscountType.FIXED;
  }

  getName(): string {
    return 'FixedDiscountStrategy';
  }
}
