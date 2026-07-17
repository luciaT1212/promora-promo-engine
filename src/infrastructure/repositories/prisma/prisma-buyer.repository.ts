import { BuyerProfile } from '../../../domain/entities/buyer-profile';
import { IBuyerRepository } from '../../../domain/interfaces/buyer.repository';
import { PrismaService } from '../../prisma/prisma.service';

export class PrismaBuyerRepository implements IBuyerRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: string): Promise<BuyerProfile | null> {
    const row = await this.prisma.buyerProfile.findUnique({ where: { id } });
    return row
      ? new BuyerProfile(row.id, row.totalOrders, row.isFirstBuyer)
      : null;
  }
  async save(profile: BuyerProfile): Promise<void> {
    await this.prisma.buyerProfile.upsert({
      where: { id: profile.buyerId },
      create: {
        id: profile.buyerId,
        totalOrders: profile.totalOrders,
        isFirstBuyer: profile.isFirstBuyer,
      },
      update: {
        totalOrders: profile.totalOrders,
        isFirstBuyer: profile.isFirstBuyer,
      },
    });
  }
}
