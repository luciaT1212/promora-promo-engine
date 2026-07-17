import { PromoCodeEngine } from '../application/engine/promo-code-engine';
import { ValidationEngine } from '../application/engine/validation-engine';
import { MandatoryValidationPipeline } from '../application/validation/pipelines/mandatory-validation.pipeline';
import { DynamicValidationPipeline } from '../application/validation/pipelines/dynamic-validation.pipeline';
import { ValidationRuleFactory } from '../application/factories/validation-rule.factory';
import { DiscountCalculator } from '../application/calculation/discount-calculator';
import { DiscountStrategyFactory } from '../application/factories/discount-strategy.factory';
import { InMemoryPromoCodeRepository } from '../infrastructure/repositories/in-memory/in-memory-promo-code.repository';
import { InMemoryPromoCodeUsageRepository } from '../infrastructure/repositories/in-memory/in-memory-usage.repository';
import { InMemoryRestrictedUserRepository } from '../infrastructure/repositories/in-memory/in-memory-restricted-user.repository';
import { InMemoryOrderRepository } from '../infrastructure/repositories/in-memory/in-memory-order.repository';
import { InMemoryCategoryHierarchyRepository } from '../infrastructure/repositories/in-memory/in-memory-category-hierarchy.repository';
import { FixedClock } from '../domain/interfaces/clock';
import { PromoCodeFactory } from '../testing/factories/promo-code.factory';
import { OrderFactory } from '../testing/factories/order.factory';
import { BuyerFactory } from '../testing/factories/buyer.factory';
import { RuleFactory } from '../testing/factories/rule.factory';
import { UsageFactory } from '../testing/factories/usage.factory';
import { ErrorCode } from '../domain/errors/error-codes';
import { PromoStateType, RuleType } from '../domain/entities/promo-code.types';
import { PromoRule } from '../domain/entities/promo-rule';
import { TierConfiguration } from '../domain/entities/tier-configuration';
import { OrderStatus } from '../domain/entities/order-status';

const NOW = new Date('2026-07-16T12:00:00.000Z');
function system() {
  const promos = new InMemoryPromoCodeRepository();
  const usages = new InMemoryPromoCodeUsageRepository();
  const restricted = new InMemoryRestrictedUserRepository();
  const orders = new InMemoryOrderRepository();
  const categories = new InMemoryCategoryHierarchyRepository();
  const validation = new ValidationEngine(
    new MandatoryValidationPipeline(promos, new FixedClock(NOW)),
    new DynamicValidationPipeline(
      new ValidationRuleFactory(usages, restricted, orders, categories),
    ),
  );
  return {
    promos,
    usages,
    restricted,
    orders,
    categories,
    engine: new PromoCodeEngine(
      validation,
      new DiscountCalculator(new DiscountStrategyFactory()),
      usages,
    ),
  };
}
const validDates = {
  startDate: new Date('2026-07-01T00:00:00Z'),
  endDate: new Date('2026-07-31T23:59:59Z'),
};

describe('Matriz QA - integración del motor', () => {
  it.each([
    ['inexistente', 'NOPE'],
    ['vacío', ''],
    ['null', null as unknown as string],
  ])('QA-01/02 código %s retorna invalid_code', async (_name, code) => {
    const s = system();
    const order = OrderFactory.create();
    const buyer = order.getOrderContext().buyerProfile;
    const result = await s.engine.validate(code, order, buyer);
    expect(result).toMatchObject({
      isValid: false,
      firstError: ErrorCode.INVALID_CODE,
    });
  });

  it.each([
    ['antes', new Date('2026-07-17'), new Date('2026-08-01'), false],
    ['después', new Date('2026-06-01'), new Date('2026-07-15'), false],
    ['igual inicio', NOW, new Date('2026-08-01'), true],
    ['igual final', new Date('2026-06-01'), NOW, true],
  ])('QA-03..06 vigencia %s', async (_n, startDate, endDate, allowed) => {
    const s = system();
    const promo = PromoCodeFactory.percent(10, {
      code: 'DATE',
      startDate,
      endDate,
    });
    await s.promos.save(promo);
    const order = OrderFactory.create();
    const result = await s.engine.validate(
      'DATE',
      order,
      order.getOrderContext().buyerProfile,
    );
    expect(result.isValid).toBe(allowed);
    expect(result.firstError).toBe(allowed ? null : ErrorCode.EXPIRED_COUPON);
  });

  it.each([
    PromoStateType.DRAFT,
    PromoStateType.PAUSED,
    PromoStateType.EXPIRED,
  ])('QA-07..09 estado %s bloqueado', async (state) => {
    const s = system();
    await s.promos.save(
      PromoCodeFactory.percent(10, { code: 'STATE', state, ...validDates }),
    );
    const o = OrderFactory.create();
    expect(
      (await s.engine.validate('STATE', o, o.getOrderContext().buyerProfile))
        .firstError,
    ).toBe(ErrorCode.INVALID_CODE);
  });

  it('QA-10 respeta existencia > vigencia > estado y early exit', async () => {
    const s = system();
    const o = OrderFactory.create();
    expect(
      (await s.engine.validate('missing', o, o.getOrderContext().buyerProfile))
        .errors,
    ).toEqual([ErrorCode.INVALID_CODE]);
    await s.promos.save(
      PromoCodeFactory.create({
        code: 'MULTI',
        state: PromoStateType.PAUSED,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-01-02'),
      }),
    );
    expect(
      (await s.engine.validate('MULTI', o, o.getOrderContext().buyerProfile))
        .errors,
    ).toEqual([ErrorCode.EXPIRED_COUPON]);
  });

  it.each([
    [99, false],
    [100, true],
    [101, true],
    [0, false],
  ])('QA-11..14 mínimo subtotal %s', async (subtotal, allowed) => {
    const s = system();
    await s.promos.save(
      PromoCodeFactory.percent(10, {
        code: 'MIN',
        rules: [RuleFactory.minPurchase(100)],
        ...validDates,
      }),
    );
    const o = OrderFactory.create({ subtotal });
    const r = await s.engine.validate(
      'MIN',
      o,
      o.getOrderContext().buyerProfile,
    );
    expect(r.isValid).toBe(allowed);
    expect(r.firstError).toBe(allowed ? null : ErrorCode.MIN_AMOUNT_REQUIRED);
  });

  it('QA-15 subtotal negativo es error controlado', async () => {
    const s = system();
    await s.promos.save(
      PromoCodeFactory.percent(10, { code: 'NEG', ...validDates }),
    );
    const o = OrderFactory.create({ subtotal: -1 });
    expect(
      (await s.engine.validate('NEG', o, o.getOrderContext().buyerProfile))
        .firstError,
    ).toBe(ErrorCode.INVALID_AMOUNT);
  });

  it.each([
    ['parent', true],
    ['child', true],
    ['other', false],
  ])('QA-16..18 categoría %s', async (categoryId, allowed) => {
    const s = system();
    s.categories.add('parent');
    s.categories.add('child', 'parent');
    s.categories.add('other');
    await s.promos.save(
      PromoCodeFactory.percent(10, {
        code: 'CAT',
        rules: [RuleFactory.eligibleCategories(['parent'])],
        ...validDates,
      }),
    );
    const o = OrderFactory.create({ categoryId });
    expect(
      (await s.engine.validate('CAT', o, o.getOrderContext().buyerProfile))
        .isValid,
    ).toBe(allowed);
  });

  it('QA-19..21 first_order_only usa solo historial pagado', async () => {
    const s = system();
    const buyer = BuyerFactory.create({ buyerId: 'b' });
    const promo = PromoCodeFactory.percent(10, {
      code: 'FIRST',
      rules: [RuleFactory.firstOrderOnly()],
      ...validDates,
    });
    await s.promos.save(promo);
    const current = OrderFactory.create({
      id: 'current',
      buyer,
      status: OrderStatus.PENDING,
    });
    await s.orders.save(current);
    expect((await s.engine.validate('FIRST', current, buyer)).isValid).toBe(
      true,
    );
    await s.orders.save(
      OrderFactory.create({ id: 'cart', buyer, status: OrderStatus.CART }),
    );
    expect((await s.engine.validate('FIRST', current, buyer)).isValid).toBe(
      true,
    );
    await s.orders.save(
      OrderFactory.create({ id: 'paid', buyer, status: OrderStatus.PAID }),
    );
    expect((await s.engine.validate('FIRST', current, buyer)).firstError).toBe(
      ErrorCode.CODE_ALREADY_USED,
    );
  });

  it('QA-22..25 límites cuentan solo usos pagados y respetan frontera', async () => {
    const s = system();
    const buyer = BuyerFactory.create({ buyerId: 'b' });
    const promo = PromoCodeFactory.percent(10, {
      id: 'p',
      code: 'LIMIT',
      rules: [
        RuleFactory.userUsageLimit(2),
        RuleFactory.globalUsageLimit(3),
        RuleFactory.globalAmountLimit(20),
      ],
      ...validDates,
    });
    await s.promos.save(promo);
    await s.usages.save(
      UsageFactory.create({
        promoCodeId: 'p',
        buyerId: 'b',
        discountAmount: 10,
        isPaid: true,
      }),
    );
    await s.usages.save(
      UsageFactory.unpaid({
        promoCodeId: 'p',
        buyerId: 'b',
        discountAmount: 999,
      }),
    );
    let o = OrderFactory.create({ buyer });
    expect((await s.engine.validate('LIMIT', o, buyer)).isValid).toBe(true);
    await s.usages.save(
      UsageFactory.create({
        promoCodeId: 'p',
        buyerId: 'b',
        discountAmount: 10,
        isPaid: true,
      }),
    );
    o = OrderFactory.create({ buyer });
    expect((await s.engine.validate('LIMIT', o, buyer)).firstError).toBe(
      ErrorCode.USAGE_LIMIT_REACHED,
    );
  });

  it('QA-24 límite global bloquea exactamente al alcanzar', async () => {
    const s = system();
    const p = PromoCodeFactory.percent(10, {
      id: 'p',
      code: 'GLOBAL',
      rules: [RuleFactory.globalUsageLimit(2)],
      ...validDates,
    });
    await s.promos.save(p);
    await s.usages.save(UsageFactory.create({ promoCodeId: 'p' }));
    await s.usages.save(UsageFactory.create({ promoCodeId: 'p' }));
    const o = OrderFactory.create();
    expect(
      (await s.engine.validate('GLOBAL', o, o.getOrderContext().buyerProfile))
        .firstError,
    ).toBe(ErrorCode.USAGE_LIMIT_REACHED);
  });

  it.each([
    [9.99, true],
    [10, false],
    [10.01, false],
  ])('QA-25 global amount historial %s', async (amount, allowed) => {
    const s = system();
    const p = PromoCodeFactory.percent(10, {
      id: 'p',
      code: 'AMOUNT',
      rules: [RuleFactory.globalAmountLimit(10)],
      ...validDates,
    });
    await s.promos.save(p);
    await s.usages.save(
      UsageFactory.create({ promoCodeId: 'p', discountAmount: amount }),
    );
    const o = OrderFactory.create();
    expect(
      (await s.engine.validate('AMOUNT', o, o.getOrderContext().buyerProfile))
        .isValid,
    ).toBe(allowed);
  });

  it('QA-26 restricted_usage permite autorizado y bloquea otro', async () => {
    const s = system();
    const p = PromoCodeFactory.percent(10, {
      id: 'p',
      code: 'R',
      rules: [RuleFactory.restrictedUsage()],
      ...validDates,
    });
    await s.promos.save(p);
    await s.restricted.authorize('p', 'ok');
    const ok = BuyerFactory.create({ buyerId: 'ok' });
    const no = BuyerFactory.create({ buyerId: 'no' });
    expect(
      (await s.engine.validate('R', OrderFactory.create({ buyer: ok }), ok))
        .isValid,
    ).toBe(true);
    expect(
      (await s.engine.validate('R', OrderFactory.create({ buyer: no }), no))
        .firstError,
    ).toBe(ErrorCode.RESTRICTED_USAGE);
  });

  it.each([
    [50, 100, 50],
    [100, 100, 100],
    [150, 100, 100],
  ])('QA-27 fixed %s subtotal %s', async (value, subtotal, expected) => {
    const s = system();
    const p = PromoCodeFactory.fixed(value, { code: 'F', ...validDates });
    await s.promos.save(p);
    const o = OrderFactory.create({ subtotal });
    expect(
      (
        await s.engine.validateAndCalculate(
          'F',
          o,
          o.getOrderContext().buyerProfile,
        )
      ).calculation?.discountAmount,
    ).toBe(expected);
  });

  it.each([
    [10, 12.34, 1.23],
    [12.5, 10, 1.25],
  ])('QA-28 percent exacto %s%%', async (value, subtotal, expected) => {
    const s = system();
    await s.promos.save(
      PromoCodeFactory.percent(value, { code: 'PCT', ...validDates }),
    );
    const o = OrderFactory.create({ subtotal });
    expect(
      (
        await s.engine.validateAndCalculate(
          'PCT',
          o,
          o.getOrderContext().buyerProfile,
        )
      ).calculation?.discountAmount,
    ).toBe(expected);
  });

  it.each([-1, 101])('QA-28 percent inválido %s controlado', async (value) => {
    const s = system();
    await s.promos.save(
      PromoCodeFactory.percent(value, { code: 'BADP', ...validDates }),
    );
    const o = OrderFactory.create();
    expect(
      (await s.engine.validate('BADP', o, o.getOrderContext().buyerProfile))
        .firstError,
    ).toBe(ErrorCode.INVALID_CONFIGURATION);
  });

  it.each([
    [0, 5],
    [3, 10],
    [7, 10],
    [10, 20],
  ])('QA-29/30 tiered %s órdenes', async (totalOrders, expectedPercent) => {
    const s = system();
    const tiers = [
      new TierConfiguration(10, 20),
      new TierConfiguration(0, 5),
      new TierConfiguration(3, 10),
    ];
    await s.promos.save(
      PromoCodeFactory.tiered(tiers, { code: 'T', ...validDates }),
    );
    const buyer = BuyerFactory.withHistory(totalOrders);
    const o = OrderFactory.create({ subtotal: 100, buyer });
    expect(
      (await s.engine.validateAndCalculate('T', o, buyer)).calculation
        ?.discountAmount,
    ).toBe(expectedPercent);
  });

  it('QA-31 tiered sin tramos es configuración inválida', async () => {
    const s = system();
    await s.promos.save(
      PromoCodeFactory.tiered([], { code: 'EMPTY', ...validDates }),
    );
    const o = OrderFactory.create();
    expect(
      (await s.engine.validate('EMPTY', o, o.getOrderContext().buyerProfile))
        .firstError,
    ).toBe(ErrorCode.INVALID_CONFIGURATION);
  });

  it.each([
    [20, 20],
    [50, 50],
    [80, 50],
  ])('QA-32 max_discount %s', async (max, expected) => {
    const s = system();
    await s.promos.save(
      PromoCodeFactory.percent(50, {
        code: 'CAP',
        postCalcRules: [RuleFactory.maxDiscount(max)],
        ...validDates,
      }),
    );
    const o = OrderFactory.create({ subtotal: 100 });
    expect(
      (
        await s.engine.validateAndCalculate(
          'CAP',
          o,
          o.getOrderContext().buyerProfile,
        )
      ).calculation?.discountAmount,
    ).toBe(expected);
  });

  it('QA-33/34 sin reglas y regla desactivada permiten', async () => {
    const s = system();
    await s.promos.save(
      PromoCodeFactory.percent(10, { code: 'NONE', ...validDates }),
    );
    await s.promos.save(
      PromoCodeFactory.percent(10, {
        code: 'OFF',
        rules: [
          new PromoRule(
            RuleType.MIN_PURCHASE_AMOUNT,
            { minAmount: 999 },
            false,
          ),
        ],
        ...validDates,
      }),
    );
    const o = OrderFactory.create({ subtotal: 1 });
    expect(
      (await s.engine.validate('NONE', o, o.getOrderContext().buyerProfile))
        .isValid,
    ).toBe(true);
    expect(
      (await s.engine.validate('OFF', o, o.getOrderContext().buyerProfile))
        .isValid,
    ).toBe(true);
  });

  it.each([
    new PromoRule('unknown' as RuleType, {}),
    new PromoRule(RuleType.MIN_PURCHASE_AMOUNT, {}),
    new PromoRule(RuleType.USER_USAGE_LIMIT, { limit: 'x' }),
  ])('QA-35/36 configuración de regla inválida no lanza', async (rule) => {
    const s = system();
    await s.promos.save(
      PromoCodeFactory.percent(10, {
        code: 'CFG',
        rules: [rule],
        ...validDates,
      }),
    );
    const o = OrderFactory.create();
    expect(
      (await s.engine.validate('CFG', o, o.getOrderContext().buyerProfile))
        .firstError,
    ).toBe(ErrorCode.INVALID_CONFIGURATION);
  });

  it('QA-37 orden sin contexto devuelve invalid_order', async () => {
    const s = system();
    await s.promos.save(
      PromoCodeFactory.percent(10, { code: 'CTX', ...validDates }),
    );
    const bad = {
      getSubtotal: () => 10,
      getOrderContext: (): never => {
        throw new Error('La orden no tiene contexto');
      },
    };
    const buyer = BuyerFactory.create();
    expect((await s.engine.validate('CTX', bad, buyer)).firstError).toBe(
      ErrorCode.INVALID_ORDER,
    );
  });

  it('QA-38/42 misma orden y carrera concurrente producen un solo uso', async () => {
    const s = system();
    const p = PromoCodeFactory.percent(10, {
      id: 'p',
      code: 'ONCE',
      ...validDates,
    });
    await s.promos.save(p);
    const o = OrderFactory.create({ id: 'same' });
    const b = o.getOrderContext().buyerProfile;
    const results = await Promise.all([
      s.engine.validateAndApply('ONCE', o.id, o, b, false),
      s.engine.validateAndApply('ONCE', o.id, o, b, false),
    ]);
    expect(results.filter((r) => r.validation.isValid)).toHaveLength(1);
    expect(
      results.find((r) => !r.validation.isValid)?.validation.firstError,
    ).toBe(ErrorCode.CODE_ALREADY_USED);
    expect(await s.usages.existsByCodeAndOrder('p', 'same')).toBe(true);
  });
});
