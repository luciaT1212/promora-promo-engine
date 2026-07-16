import { OrderableInterface } from '../interfaces/orderable.interface';
import { BuyerProfile } from '../entities/buyer-profile';
import { PromoCode } from '../entities/promo-code';

export class ValidationContext {
  constructor(
    public readonly promoCodeString: string,
    public readonly order: OrderableInterface,
    public readonly buyer: BuyerProfile,
    public promo: PromoCode | null = null,
  ) {}
}
