import { FixedDiscountStrategy } from './fixed-discount.strategy';
import { PromoCodeFactory } from '../../../testing/factories/promo-code.factory';
import { OrderFactory } from '../../../testing/factories/order.factory';
import { DiscountType } from '../../../domain/entities/promo-code.types';

describe('FixedDiscountStrategy', () => {
  const strategy = new FixedDiscountStrategy();

  it('canHandle retorna true solo para fixed', () => {
    expect(strategy.canHandle(DiscountType.FIXED)).toBe(true);
    expect(strategy.canHandle(DiscountType.PERCENT)).toBe(false);
    expect(strategy.canHandle(DiscountType.TIERED)).toBe(false);
  });

  it('descuenta el valor fijo si el subtotal lo permite', () => {
    const promo = PromoCodeFactory.fixed(10);
    const order = OrderFactory.create({ subtotal: 100 });

    expect(strategy.calculate(promo, order)).toBe(10);
  });

  it('nunca descuenta mas que el subtotal', () => {
    const promo = PromoCodeFactory.fixed(50);
    const order = OrderFactory.create({ subtotal: 30 });

    expect(strategy.calculate(promo, order)).toBe(30);
  });
});
