import { v4 as uuid } from 'uuid';
import { BuyerProfile } from '../../domain/entities/buyer-profile';

export class BuyerFactory {
  static create(overrides: Partial<BuyerProfile> = {}): BuyerProfile {
    return new BuyerProfile(
      overrides.buyerId ?? uuid(),
      overrides.totalOrders ?? 0,
      overrides.isFirstBuyer ?? (overrides.totalOrders ?? 0) === 0,
    );
  }

  static firstBuyer(): BuyerProfile {
    return this.create({ totalOrders: 0, isFirstBuyer: true });
  }

  static withHistory(totalOrders: number): BuyerProfile {
    return this.create({ totalOrders, isFirstBuyer: false });
  }
}
