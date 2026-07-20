import { Injectable } from '@nestjs/common';
import { IDiscountStrategy } from '../discount-strategy.interface';
import { DiscountType } from '../../../domain/entities/promo-code.entity';

@Injectable()
export class PercentDiscountStrategy implements IDiscountStrategy {
  calculate(value: number, subtotal: number): number {
    if (value < 0 || value > 100) {
      throw new Error(`Porcentaje inválido: ${value}. Debe estar entre 0 y 100`);
    }
    return subtotal * (value / 100);
  }

  canHandle(type: DiscountType): boolean {
    return type === DiscountType.PERCENT;
  }

  getName(): string {
    return 'PercentDiscountStrategy';
  }
}
