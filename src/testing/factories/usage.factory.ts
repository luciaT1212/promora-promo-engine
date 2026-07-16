import { v4 as uuid } from 'uuid';
import { PromoCodeUsage } from '../../domain/entities/promo-code-usage';

export interface UsageFactoryOverrides {
  id?: string;
  promoCodeId?: string;
  orderId?: string;
  buyerId?: string;
  discountAmount?: number;
  isPaid?: boolean;
  createdAt?: Date;
}

export class UsageFactory {
  static create(overrides: UsageFactoryOverrides = {}): PromoCodeUsage {
    return new PromoCodeUsage(
      overrides.id ?? uuid(),
      overrides.promoCodeId ?? uuid(),
      overrides.orderId ?? uuid(),
      overrides.buyerId ?? uuid(),
      overrides.discountAmount ?? 10,
      overrides.isPaid ?? true,
      overrides.createdAt ?? new Date(),
    );
  }

  static unpaid(overrides: UsageFactoryOverrides = {}): PromoCodeUsage {
    return this.create({ ...overrides, isPaid: false });
  }
}
