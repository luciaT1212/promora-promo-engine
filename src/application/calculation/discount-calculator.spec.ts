import { DiscountCalculator } from './discount-calculator';
import { DiscountStrategyFactory } from '../factories/discount-strategy.factory';
import { PromoCodeFactory } from '../../testing/factories/promo-code.factory';
import { RuleFactory } from '../../testing/factories/rule.factory';
import { OrderFactory } from '../../testing/factories/order.factory';
import { BuyerFactory } from '../../testing/factories/buyer.factory';
import { TierConfiguration } from '../../domain/entities/tier-configuration';

describe('DiscountCalculator', () => {
  const calculator = new DiscountCalculator(new DiscountStrategyFactory());

  it('calcula descuento fixed correctamente', () => {
    const promo = PromoCodeFactory.fixed(10);
    const order = OrderFactory.create({ subtotal: 100 });

    const result = calculator.calculate(promo, order);
    expect(result.originalAmount).toBe(100);
    expect(result.discountAmount).toBe(10);
    expect(result.finalAmount).toBe(90);
  });

  it('calcula descuento percent correctamente', () => {
    const promo = PromoCodeFactory.percent(20);
    const order = OrderFactory.create({ subtotal: 250 });

    const result = calculator.calculate(promo, order);
    expect(result.discountAmount).toBe(50);
    expect(result.finalAmount).toBe(200);
  });

  it('calcula descuento tiered eligiendo el tramo correcto', () => {
    const promo = PromoCodeFactory.tiered([
      new TierConfiguration(0, 5),
      new TierConfiguration(3, 10),
    ]);
    const order = OrderFactory.create({
      subtotal: 100,
      buyer: BuyerFactory.withHistory(5),
    });

    const result = calculator.calculate(promo, order);
    expect(result.discountAmount).toBe(10);
    expect(result.finalAmount).toBe(90);
  });

  it('aplica el tope max_discount_amount cuando la regla esta configurada', () => {
    const promo = PromoCodeFactory.percent(50, {
      postCalcRules: [RuleFactory.maxDiscount(20)],
    });
    const order = OrderFactory.create({ subtotal: 200 });

    const result = calculator.calculate(promo, order);
    expect(result.discountAmount).toBe(20);
    expect(result.finalAmount).toBe(180);
  });
});
