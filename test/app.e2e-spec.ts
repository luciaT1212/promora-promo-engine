import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from '../src/presentation/http/configure-app';
import { ErrorCode } from '../src/domain/errors/error-codes';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('QA-39 request promo válido usa la orden del repositorio', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/promo/calculate')
      .send({ code: 'SUMMER15', orderId: 'demo-order-100' })
      .expect(200);
    expect(response.body).toEqual({
      valid: true,
      discount: { originalAmount: 100, discountAmount: 15, finalAmount: 85 },
    });
  });

  it.each([
    [{ orderId: 'demo-order-100' }, 'código faltante'],
    [{ code: 123, orderId: 'demo-order-100' }, 'tipo incorrecto'],
    [{ code: 'SUMMER15', orderId: 123 }, 'orderId incorrecto'],
  ])('QA-40 request inválido: %s (%s)', async (body) => {
    await request(app.getHttpServer())
      .post('/api/promo/calculate')
      .send(body)
      .expect(400);
  });

  it('QA-41 rechaza subtotal manipulado y usa subtotal interno', async () => {
    await request(app.getHttpServer())
      .post('/api/promo/calculate')
      .send({ code: 'SUMMER15', orderId: 'demo-order-100', subtotal: 1 })
      .expect(400);
    const response = await request(app.getHttpServer())
      .post('/api/promo/calculate')
      .send({ code: 'SUMMER15', orderId: 'demo-order-100' })
      .expect(200);
    const body = response.body as { discount: { originalAmount: number } };
    expect(body.discount.originalAmount).toBe(100);
  });

  it('orden inexistente retorna error semántico controlado', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/promo/validate')
      .send({ code: 'SUMMER15', orderId: 'missing' })
      .expect(400);
    const body = response.body as { errorCode: string };
    expect(body.errorCode).toBe(ErrorCode.INVALID_ORDER);
  });

  it('validate no calcula ni registra', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/promo/validate')
      .send({ code: 'SUMMER15', orderId: 'demo-order-100' })
      .expect(200);
    expect(response.body).toEqual({ valid: true });
  });

  it('calculate calcula sin registrar', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/promo/calculate')
      .send({ code: 'SUMMER15', orderId: 'demo-order-100' })
      .expect(200);
    const body = response.body as { discount: { discountAmount: number } };
    expect(body.discount.discountAmount).toBe(15);
  });

  it('apply registra una vez y bloquea duplicados', async () => {
    const payload = {
      code: 'SUMMER15',
      orderId: 'demo-order-100',
      isPaid: false,
    };
    await request(app.getHttpServer())
      .post('/api/promo/apply')
      .send(payload)
      .expect(200);
    const duplicate = await request(app.getHttpServer())
      .post('/api/promo/apply')
      .send(payload)
      .expect(200);
    expect(duplicate.body).toEqual({
      valid: false,
      errorCode: ErrorCode.CODE_ALREADY_USED,
    });
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterEach(async () => {
    await app.close();
  });
});
