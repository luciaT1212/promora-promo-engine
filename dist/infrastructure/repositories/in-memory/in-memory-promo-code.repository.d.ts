import { IPromoCodeRepository } from '../../../domain/interfaces/promo-code.repository';
import { PromoCode } from '../../../domain/entities/promo-code';
export declare class InMemoryPromoCodeRepository implements IPromoCodeRepository {
    private readonly store;
    findByCode(code: string): Promise<PromoCode | null>;
    findById(id: string): Promise<PromoCode | null>;
    save(promoCode: PromoCode): Promise<void>;
    clear(): void;
}
