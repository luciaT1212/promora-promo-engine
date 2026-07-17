import { PromoStateType } from '../entities/promo-code.types';
import { PromoState } from './promo-state';

export class PausedState implements PromoState {
  readonly type = PromoStateType.PAUSED;
  canBeUsed(): boolean {
    return false;
  }
}
