import { v4 as uuid } from 'uuid';
import { PromoCode } from '../../domain/entities/promo-code';
import {
  DiscountType,
  PromoState,
} from '../../domain/entities/promo-code.types';
import { PromoRule } from '../../domain/entities/promo-rule';
import { PostCalcRule } from '../../domain/entities/post-calc-rule';
import { TierConfiguration } from '../../domain/entities/tier-configuration';

export interface PromoCodeFactoryOverrides {
  id?: string;
  code?: string;
  type?: DiscountType;
  value?: number;
  state?: PromoState;
  startDate?: Date;
  endDate?: Date;
  rules?: readonly PromoRule[];
  postCalcRules?: readonly PostCalcRule[];
  tiers?: readonly TierConfiguration[];
}

export class PromoCodeFactory {
  static create(overrides: PromoCodeFactoryOverrides = {}): PromoCode {
    const now = new Date();
    const oneMonthAhead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return new PromoCode(
      overrides.id ?? uuid(),
      overrides.code ?? `TEST-${Math.floor(Math.random() * 10000)}`,
      overrides.type ?? DiscountType.PERCENT,
      overrides.value ?? 10,
      overrides.state ?? PromoState.ACTIVE,
      overrides.startDate ?? oneMonthAgo,
      overrides.endDate ?? oneMonthAhead,
      overrides.rules ?? [],
      overrides.postCalcRules ?? [],
      overrides.tiers ?? [],
    );
  }

  static fixed(value: number, over: PromoCodeFactoryOverrides = {}): PromoCode {
    return this.create({ ...over, type: DiscountType.FIXED, value });
  }

  static percent(
    value: number,
    over: PromoCodeFactoryOverrides = {},
  ): PromoCode {
    return this.create({ ...over, type: DiscountType.PERCENT, value });
  }

  static tiered(
    tiers: readonly TierConfiguration[],
    over: PromoCodeFactoryOverrides = {},
  ): PromoCode {
    return this.create({ ...over, type: DiscountType.TIERED, value: 0, tiers });
  }

  static draft(over: PromoCodeFactoryOverrides = {}): PromoCode {
    return this.create({ ...over, state: PromoState.DRAFT });
  }

  static paused(over: PromoCodeFactoryOverrides = {}): PromoCode {
    return this.create({ ...over, state: PromoState.PAUSED });
  }

  static expiredByDate(over: PromoCodeFactoryOverrides = {}): PromoCode {
    const past = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const morePast = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
    return this.create({ ...over, startDate: morePast, endDate: past });
  }

  static notYetActive(over: PromoCodeFactoryOverrides = {}): PromoCode {
    const future = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    const moreFuture = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);
    return this.create({ ...over, startDate: future, endDate: moreFuture });
  }
}
