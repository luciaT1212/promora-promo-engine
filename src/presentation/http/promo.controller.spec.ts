import { Test, TestingModule } from '@nestjs/testing';
import { PromoController } from './promo.controller';
import { ValidatePromoRequestDto } from './dto/validate-promo.dto';
import { ErrorCode } from '../../domain/errors/error-codes';

describe('PromoController (integracion HTTP)', () => {
  let controller: PromoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromoController],
    }).compile();
    controller = module.get<PromoController>(PromoController);
  });

  const buildRequest = (
    overrides: Partial<ValidatePromoRequestDto> = {},
  ): ValidatePromoRequestDto => ({
    code: 'SUMMER15',
    orderId: 'order-1',
    subtotal: 100,
    categoryId: 'cat-default',
    buyer: {
      buyerId: 'buyer-1',
      totalOrders: 5,
      isFirstBuyer: false,
    },
    ...overrides,
  });

  it('SUMMER15 aplica 15% de descuento', async () => {
    const response = await controller.validate(buildRequest());
    expect(response.valid).toBe(true);
    expect(response.discount!.discountAmount).toBe(15);
    expect(response.discount!.finalAmount).toBe(85);
  });

  it('codigo inexistente retorna invalid_code', async () => {
    const response = await controller.validate(
      buildRequest({ code: 'NO-EXISTE' }),
    );
    expect(response.valid).toBe(false);
    expect(response.errorCode).toBe(ErrorCode.INVALID_CODE);
  });

  it('FIRST10 rechaza si el comprador tiene historial', async () => {
    const response = await controller.validate(
      buildRequest({
        code: 'FIRST10',
        buyer: { buyerId: 'buyer-1', totalOrders: 3, isFirstBuyer: false },
      }),
    );
    expect(response.valid).toBe(false);
    expect(response.errorCode).toBe(ErrorCode.CODE_ALREADY_USED);
  });

  it('CAPPED50 aplica el tope max_discount_amount', async () => {
    const response = await controller.validate(
      buildRequest({ code: 'CAPPED50', subtotal: 200 }),
    );
    expect(response.valid).toBe(true);
    // 50% de 200 = 100, pero el tope es $30
    expect(response.discount!.discountAmount).toBe(30);
  });

  it('FLAT20 aplica $20 fijo', async () => {
    const response = await controller.validate(
      buildRequest({ code: 'FLAT20', subtotal: 100 }),
    );
    expect(response.valid).toBe(true);
    expect(response.discount!.discountAmount).toBe(20);
  });
});
