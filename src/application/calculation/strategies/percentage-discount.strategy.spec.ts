import { PercentageDiscountStrategy } from './percentage-discount.strategy';
import { PromoCodeFactory } from '../../../testing/factories/promo-code.factory';
import { OrderFactory } from '../../../testing/factories/order.factory';
import { DiscountType } from '../../../domain/entities/promo-code.types';

describe('PercentageDiscountStrategy', () => {
  const strategy = new PercentageDiscountStrategy();

  it('canHandle retorna true solo para percent', () => {
    expect(strategy.canHandle(DiscountType.PERCENT)).toBe(true);
    expect(strategy.canHandle(DiscountType.FIXED)).toBe(false);
    expect(strategy.canHandle(DiscountType.TIERED)).toBe(false);
  });

  it('calcula el porcentaje sobre el subtotal', () => {
    const promo = PromoCodeFactory.percent(15);
    const order = OrderFactory.create({ subtotal: 200 });

    expect(strategy.calculate(promo, order)).toBe(30);
  });

  it('redondea a 2 decimales', () => {
    const promo = PromoCodeFactory.percent(33);
    const order = OrderFactory.create({ subtotal: 100 });

    expect(strategy.calculate(promo, order)).toBe(33);
  });
});
