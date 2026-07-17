import { PromoStateType } from '../entities/promo-code.types';
import { ActiveState } from './active.state';
import { DraftState } from './draft.state';
import { ExpiredState } from './expired.state';
import { PausedState } from './paused.state';
import { PromoState } from './promo-state';

export class PromoStateFactory {
  private readonly states = new Map<PromoStateType, PromoState>([
    [PromoStateType.DRAFT, new DraftState()],
    [PromoStateType.ACTIVE, new ActiveState()],
    [PromoStateType.PAUSED, new PausedState()],
    [PromoStateType.EXPIRED, new ExpiredState()],
  ]);

  create(type: PromoStateType): PromoState {
    const state = this.states.get(type);
    if (!state)
      throw new Error(`Estado promocional desconocido: ${String(type)}`);
    return state;
  }
}
