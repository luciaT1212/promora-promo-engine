import { TieredDiscountStrategy } from './tiered-discount.strategy';
import { PromoCodeFactory } from '../../../testing/factories/promo-code.factory';
import { OrderFactory } from '../../../testing/factories/order.factory';
import { BuyerFactory } from '../../../testing/factories/buyer.factory';
import { TierConfiguration } from '../../../domain/entities/tier-configuration';
import { DiscountType } from '../../../domain/entities/promo-code.types';

describe('TieredDiscountStrategy', () => {
  const strategy = new TieredDiscountStrategy();

  const tiers = [
    new TierConfiguration(0, 5),
    new TierConfiguration(3, 10),
    new TierConfiguration(10, 15),
  ];

  it('canHandle retorna true solo para tiered', () => {
    expect(strategy.canHandle(DiscountType.TIERED)).toBe(true);
    expect(strategy.canHandle(DiscountType.FIXED)).toBe(false);
    expect(strategy.canHandle(DiscountType.PERCENT)).toBe(false);
  });

  it('aplica 5% al comprador sin historial (tramo 0)', () => {
    const promo = PromoCodeFactory.tiered(tiers);
    const order = OrderFactory.create({
      subtotal: 100,
      buyer: BuyerFactory.withHistory(0),
    });

    expect(strategy.calculate(promo, order)).toBe(5);
  });

  it('aplica 10% al comprador con 3 ordenes previas', () => {
    const promo = PromoCodeFactory.tiered(tiers);
    const order = OrderFactory.create({
      subtotal: 100,
      buyer: BuyerFactory.withHistory(3),
    });

    expect(strategy.calculate(promo, order)).toBe(10);
  });

  it('aplica 15% al comprador con 10 ordenes previas', () => {
    const promo = PromoCodeFactory.tiered(tiers);
    const order = OrderFactory.create({
      subtotal: 100,
      buyer: BuyerFactory.withHistory(10),
    });

    expect(strategy.calculate(promo, order)).toBe(15);
  });

  it('aplica el tramo mas alto elegible (no el minimo)', () => {
    const promo = PromoCodeFactory.tiered(tiers);
    const order = OrderFactory.create({
      subtotal: 200,
      buyer: BuyerFactory.withHistory(15),
    });

    expect(strategy.calculate(promo, order)).toBe(30);
  });
});
