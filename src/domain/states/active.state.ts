import { PromoStateType } from '../entities/promo-code.types';
import { PromoState } from './promo-state';

export class ActiveState implements PromoState {
  readonly type = PromoStateType.ACTIVE;
  canBeUsed(): boolean {
    return true;
  }
}
