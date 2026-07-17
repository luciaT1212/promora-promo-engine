import { IRestrictedUserRepository } from '../../../domain/interfaces/restricted-user.repository';

export class InMemoryRestrictedUserRepository implements IRestrictedUserRepository {
  private readonly store = new Map<string, Set<string>>();

  async isBuyerAuthorized(
    promoCodeId: string,
    buyerId: string,
  ): Promise<boolean> {
    return this.store.get(promoCodeId)?.has(buyerId) ?? false;
  }

  async authorize(promoCodeId: string, buyerId: string): Promise<void> {
    if (!this.store.has(promoCodeId)) {
      this.store.set(promoCodeId, new Set());
    }
    this.store.get(promoCodeId)!.add(buyerId);
  }

  clear(): void {
    this.store.clear();
  }
}
