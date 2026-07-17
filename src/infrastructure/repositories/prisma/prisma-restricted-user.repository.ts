import { IRestrictedUserRepository } from '../../../domain/interfaces/restricted-user.repository';
import { PrismaService } from '../../prisma/prisma.service';

export class PrismaRestrictedUserRepository implements IRestrictedUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async isBuyerAuthorized(
    promoCodeId: string,
    buyerId: string,
  ): Promise<boolean> {
    return (
      (await this.prisma.restrictedUserMapping.count({
        where: { promoCodeId, buyerId },
      })) > 0
    );
  }
  async authorize(promoCodeId: string, buyerId: string): Promise<void> {
    await this.prisma.restrictedUserMapping.upsert({
      where: { promoCodeId_buyerId: { promoCodeId, buyerId } },
      create: { promoCodeId, buyerId },
      update: {},
    });
  }
}
