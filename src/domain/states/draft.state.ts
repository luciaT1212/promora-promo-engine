import { PromoStateType } from '../entities/promo-code.types';
import { PromoState } from './promo-state';

export class DraftState implements PromoState {
  readonly type = PromoStateType.DRAFT;
  canBeUsed(): boolean {
    return false;
  }
}
