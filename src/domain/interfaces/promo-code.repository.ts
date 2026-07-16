import { PromoCode } from '../entities/promo-code';

export interface IPromoCodeRepository {
  findByCode(code: string): Promise<PromoCode | null>;
  findById(id: string): Promise<PromoCode | null>;
  save(promoCode: PromoCode): Promise<void>;
}
