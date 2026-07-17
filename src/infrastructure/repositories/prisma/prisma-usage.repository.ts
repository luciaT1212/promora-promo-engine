import { Prisma } from '@prisma/client';
import { PromoCodeUsage } from '../../../domain/entities/promo-code-usage';
import { IPromoCodeUsageRepository } from '../../../domain/interfaces/promo-code-usage.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { AsyncLocalStorage } from 'node:async_hooks';
import { DuplicatePromoUsageError } from '../../../domain/errors/duplicate-promo-usage.error';

type UsageClient = PrismaService | Prisma.TransactionClient;

export class PrismaPromoCodeUsageRepository implements IPromoCodeUsageRepository {
  private readonly transactionContext =
    new AsyncLocalStorage<Prisma.TransactionClient>();
  constructor(private readonly client: UsageClient) {}
  runSerializable<T>(
    operation: (repository: IPromoCodeUsageRepository) => Promise<T>,
  ): Promise<T> {
    if (!('$transaction' in this.client)) return operation(this);
    return this.runWithRetry(operation);
  }
  async save(usage: PromoCodeUsage): Promise<void> {
    try {
      await this.currentClient.promoCodeUsage.create({
        data: {
          id: usage.id,
          promoCodeId: usage.promoCodeId,
          orderId: usage.orderId,
          buyerId: usage.buyerId,
          discountAmount: usage.discountAmount,
          isPaid: usage.isPaid,
          createdAt: usage.createdAt,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new DuplicatePromoUsageError();
      throw error;
    }
  }
  async existsByCodeAndOrder(
    promoCodeId: string,
    orderId: string,
  ): Promise<boolean> {
    return (
      (await this.currentClient.promoCodeUsage.count({
        where: { promoCodeId, orderId },
      })) > 0
    );
  }
  countPaidUsesByCode(
    promoCodeId: string,
    excludeOrderIds: readonly string[] = [],
  ): Promise<number> {
    return this.currentClient.promoCodeUsage.count({
      where: {
        promoCodeId,
        isPaid: true,
        orderId: { notIn: [...excludeOrderIds] },
      },
    });
  }
  countPaidUsesByCodeAndBuyer(
    promoCodeId: string,
    buyerId: string,
    excludeOrderIds: readonly string[] = [],
  ): Promise<number> {
    return this.currentClient.promoCodeUsage.count({
      where: {
        promoCodeId,
        buyerId,
        isPaid: true,
        orderId: { notIn: [...excludeOrderIds] },
      },
    });
  }
  async sumPaidDiscountByCode(
    promoCodeId: string,
    excludeOrderIds: readonly string[] = [],
  ): Promise<number> {
    const result = await this.currentClient.promoCodeUsage.aggregate({
      _sum: { discountAmount: true },
      where: {
        promoCodeId,
        isPaid: true,
        orderId: { notIn: [...excludeOrderIds] },
      },
    });
    return result._sum.discountAmount?.toNumber() ?? 0;
  }

  private get currentClient(): UsageClient {
    return this.transactionContext.getStore() ?? this.client;
  }

  private async runWithRetry<T>(
    operation: (repository: IPromoCodeUsageRepository) => Promise<T>,
    attempt = 1,
  ): Promise<T> {
    try {
      const client = this.client as PrismaService;
      return await client.$transaction(
        (tx) => this.transactionContext.run(tx, () => operation(this)),
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2034' &&
        attempt < 3
      )
        return this.runWithRetry(operation, attempt + 1);
      throw error;
    }
  }
}
