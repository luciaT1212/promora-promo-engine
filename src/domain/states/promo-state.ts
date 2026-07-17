import { PromoStateType } from '../entities/promo-code.types';

export interface PromoState {
  readonly type: PromoStateType;
  canBeUsed(): boolean;
}
