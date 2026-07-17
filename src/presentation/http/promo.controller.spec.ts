import { Test, TestingModule } from '@nestjs/testing';
import { PromoController } from './promo.controller';
import { ValidatePromoRequestDto } from './dto/validate-promo.dto';
import { ErrorCode } from '../../domain/errors/error-codes';
import { PromoEngineProvider } from './promo-engine.provider';

describe('PromoController (integracion HTTP)', () => {
  let controller: PromoController;

  beforeEach(async () => {
    const provider = new PromoEngineProvider();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromoController],
      providers: [{ provide: PromoEngineProvider, useValue: provider }],
    }).compile();
    controller = module.get<PromoController>(PromoController);
  });

  const buildRequest = (
    overrides: Partial<ValidatePromoRequestDto> = {},
  ): ValidatePromoRequestDto => ({
    code: 'SUMMER15',
    orderId: 'demo-order-100',
    ...overrides,
  });

  it('SUMMER15 aplica 15% de descuento', async () => {
    const response = await controller.calculate(buildRequest());
    expect(response.valid).toBe(true);
    expect(response.discount!.discountAmount).toBe(15);
    expect(response.discount!.finalAmount).toBe(85);
  });

  it('codigo inexistente retorna invalid_code', async () => {
    const response = await controller.calculate(
      buildRequest({ code: 'NO-EXISTE' }),
    );
    expect(response.valid).toBe(false);
    expect(response.errorCode).toBe(ErrorCode.INVALID_CODE);
  });

  it('FIRST10 rechaza si el comprador tiene historial', async () => {
    const response = await controller.calculate(
      buildRequest({
        code: 'FIRST10',
        orderId: 'returning-current',
      }),
    );
    expect(response.valid).toBe(false);
    expect(response.errorCode).toBe(ErrorCode.CODE_ALREADY_USED);
  });

  it('CAPPED50 aplica el tope max_discount_amount', async () => {
    const response = await controller.calculate(
      buildRequest({ code: 'CAPPED50', orderId: 'demo-order-200' }),
    );
    expect(response.valid).toBe(true);
    expect(response.discount!.discountAmount).toBe(30);
  });

  it('FLAT20 aplica $20 fijo', async () => {
    const response = await controller.calculate(
      buildRequest({ code: 'FLAT20', subtotal: 100 }),
    );
    expect(response.valid).toBe(true);
    expect(response.discount!.discountAmount).toBe(20);
  });
});
