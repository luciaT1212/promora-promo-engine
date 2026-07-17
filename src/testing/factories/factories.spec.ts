import { PromoCodeFactory } from './promo-code.factory';
import { RuleFactory } from './rule.factory';
import { OrderFactory } from './order.factory';
import { BuyerFactory } from './buyer.factory';
import {
  DiscountType,
  PromoStateType,
  RuleType,
} from '../../domain/entities/promo-code.types';

describe('Factories - smoke tests', () => {
  it('PromoCodeFactory.percent crea un código percent activo por defecto', () => {
    const promo = PromoCodeFactory.percent(15);
    expect(promo.type).toBe(DiscountType.PERCENT);
    expect(promo.value).toBe(15);
    expect(promo.state).toBe(PromoStateType.ACTIVE);
    expect(promo.isActive()).toBe(true);
  });

  it('PromoCodeFactory.expiredByDate crea un código con endDate en el pasado', () => {
    const promo = PromoCodeFactory.expiredByDate();
    expect(promo.isExpired()).toBe(true);
  });

  it('PromoCodeFactory acepta reglas activas via RuleFactory', () => {
    const promo = PromoCodeFactory.percent(10, {
      rules: [RuleFactory.minPurchase(50)],
    });
    expect(promo.hasRule(RuleType.MIN_PURCHASE_AMOUNT)).toBe(true);
    const rule = promo.getRule(RuleType.MIN_PURCHASE_AMOUNT);
    expect(rule?.parameters.minAmount).toBe(50);
  });

  it('BuyerFactory.firstBuyer crea comprador sin historial', () => {
    const buyer = BuyerFactory.firstBuyer();
    expect(buyer.totalOrders).toBe(0);
    expect(buyer.isFirstBuyer).toBe(true);
  });

  it('OrderFactory crea Order con context completo', () => {
    const order = OrderFactory.create({ subtotal: 250, categoryId: 'cat-1' });
    expect(order.getSubtotal()).toBe(250);
    expect(order.getOrderContext().categoryId).toBe('cat-1');
  });
});
