import { PromoStateType } from '../entities/promo-code.types';
import { PromoState } from './promo-state';

export class ExpiredState implements PromoState {
  readonly type = PromoStateType.EXPIRED;
  canBeUsed(): boolean {
    return false;
  }
}
