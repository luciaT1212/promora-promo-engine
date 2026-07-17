import { Prisma } from '@prisma/client';
import { PrismaPromoCodeUsageRepository } from './prisma-usage.repository';
import { UsageFactory } from '../../../testing/factories/usage.factory';

describe('PrismaPromoCodeUsageRepository', () => {
  it('persiste usos y filtra agregados por pagadas', async () => {
    const create = jest.fn().mockResolvedValue({});
    const count = jest.fn().mockResolvedValue(2);
    const aggregate = jest.fn().mockResolvedValue({
      _sum: { discountAmount: new Prisma.Decimal(12.5) },
    });
    const client = { promoCodeUsage: { create, count, aggregate } } as never;
    const repository = new PrismaPromoCodeUsageRepository(client);
    await repository.save(
      UsageFactory.create({
        promoCodeId: '00000000-0000-0000-0000-000000000001',
      }),
    );
    expect(create).toHaveBeenCalledTimes(1);
    expect(await repository.countPaidUsesByCode('promo')).toBe(2);
    expect(count).toHaveBeenLastCalledWith({
      where: { promoCodeId: 'promo', isPaid: true, orderId: { notIn: [] } },
    });
    expect(await repository.sumPaidDiscountByCode('promo')).toBe(12.5);
  });
  it('ejecuta apply dentro de una transacción Serializable', async () => {
    const transactionClient = { promoCodeUsage: {} };
    const transaction = jest.fn(
      async (
        operation: (client: typeof transactionClient) => Promise<string>,
        options: unknown,
      ) => {
        expect(options).toEqual({
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        });
        return operation(transactionClient);
      },
    );
    const client = { $transaction: transaction, promoCodeUsage: {} } as never;
    const repository = new PrismaPromoCodeUsageRepository(client);
    await expect(repository.runSerializable(async () => 'ok')).resolves.toBe(
      'ok',
    );
    expect(transaction).toHaveBeenCalledTimes(1);
  });
});
