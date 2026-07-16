import { MaxDiscountAmountRule } from './max-discount-amount.rule';
import { PromoCodeFactory } from '../../../testing/factories/promo-code.factory';
import { RuleFactory } from '../../../testing/factories/rule.factory';

describe('MaxDiscountAmountRule', () => {
  const postRule = new MaxDiscountAmountRule();

  it('tope de $20 sobre un descuento de $50 lo limita a $20', () => {
    const promo = PromoCodeFactory.percent(50, {
      postCalcRules: [RuleFactory.maxDiscount(20)],
    });
    expect(postRule.apply(promo, 50)).toBe(20);
  });

  it('no altera el descuento si esta por debajo del tope', () => {
    const promo = PromoCodeFactory.percent(10, {
      postCalcRules: [RuleFactory.maxDiscount(50)],
    });
    expect(postRule.apply(promo, 30)).toBe(30);
  });

  it('no altera el descuento si la regla no esta configurada', () => {
    const promo = PromoCodeFactory.percent(10);
    expect(postRule.apply(promo, 500)).toBe(500);
  });
});
