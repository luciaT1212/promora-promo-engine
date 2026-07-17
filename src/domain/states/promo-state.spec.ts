import { PromoStateType } from '../entities/promo-code.types';
import { PromoStateFactory } from './promo-state.factory';

describe('PromoState', () => {
  const factory = new PromoStateFactory();
  it.each([
    [PromoStateType.ACTIVE, true],
    [PromoStateType.DRAFT, false],
    [PromoStateType.PAUSED, false],
    [PromoStateType.EXPIRED, false],
  ])('%s decide si la promoción puede utilizarse', (type, expected) => {
    expect(factory.create(type).canBeUsed()).toBe(expected);
  });
});
