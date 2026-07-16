import { IBuyerRepository } from '../../../domain/interfaces/buyer.repository';
import { BuyerProfile } from '../../../domain/entities/buyer-profile';

export class InMemoryBuyerRepository implements IBuyerRepository {
  private readonly store = new Map<string, BuyerProfile>();

  async findById(buyerId: string): Promise<BuyerProfile | null> {
    return this.store.get(buyerId) ?? null;
  }

  async save(profile: BuyerProfile): Promise<void> {
    this.store.set(profile.buyerId, profile);
  }

  clear(): void {
    this.store.clear();
  }
}
