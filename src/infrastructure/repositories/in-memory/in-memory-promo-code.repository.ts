import { IPromoCodeRepository } from '../../../domain/interfaces/promo-code.repository';
import { PromoCode } from '../../../domain/entities/promo-code';

export class InMemoryPromoCodeRepository implements IPromoCodeRepository {
  private readonly store = new Map<string, PromoCode>();

  async findByCode(code: string): Promise<PromoCode | null> {
    for (const promo of this.store.values()) {
      if (promo.code === code) return promo;
    }
    return null;
  }

  async findById(id: string): Promise<PromoCode | null> {
    return this.store.get(id) ?? null;
  }

  async save(promoCode: PromoCode): Promise<void> {
    this.store.set(promoCode.id, promoCode);
  }

  clear(): void {
    this.store.clear();
  }
}
