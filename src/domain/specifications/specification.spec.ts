import { AndSpecification } from './and.specification';
import { NotSpecification } from './not.specification';
import { OrSpecification } from './or.specification';
import { Specification } from './specification';
import { FirstOrderSpecification } from './first-order.specification';
import { AuthorizedBuyerSpecification } from './authorized-buyer.specification';
import { EligibleCategorySpecification } from './eligible-category.specification';
import { InMemoryRestrictedUserRepository } from '../../infrastructure/repositories/in-memory/in-memory-restricted-user.repository';
import { InMemoryCategoryHierarchyRepository } from '../../infrastructure/repositories/in-memory/in-memory-category-hierarchy.repository';

class BooleanSpecification implements Specification<boolean> {
  isSatisfiedBy(candidate: boolean): Promise<boolean> {
    return Promise.resolve(candidate);
  }
}

describe('Specification', () => {
  const truth = new BooleanSpecification();
  it('compone AND, OR y NOT', async () => {
    expect(await new AndSpecification(truth, truth).isSatisfiedBy(true)).toBe(
      true,
    );
    expect(await new OrSpecification(truth, truth).isSatisfiedBy(false)).toBe(
      false,
    );
    expect(await new NotSpecification(truth).isSatisfiedBy(false)).toBe(true);
  });
  it('FirstOrderSpecification solo acepta historial pagado vacío', async () => {
    const specification = new FirstOrderSpecification();
    expect(await specification.isSatisfiedBy({ paidOrderCount: 0 })).toBe(true);
    expect(await specification.isSatisfiedBy({ paidOrderCount: 1 })).toBe(
      false,
    );
  });
  it('AuthorizedBuyerSpecification consulta autorizaciones reutilizables', async () => {
    const repository = new InMemoryRestrictedUserRepository();
    await repository.authorize('promo', 'buyer');
    const specification = new AuthorizedBuyerSpecification(repository);
    expect(
      await specification.isSatisfiedBy({
        promoCodeId: 'promo',
        buyerId: 'buyer',
      }),
    ).toBe(true);
    expect(
      await specification.isSatisfiedBy({
        promoCodeId: 'promo',
        buyerId: 'other',
      }),
    ).toBe(false);
  });
  it('EligibleCategorySpecification reconoce descendientes', async () => {
    const hierarchy = new InMemoryCategoryHierarchyRepository();
    hierarchy.add('parent');
    hierarchy.add('child', 'parent');
    const specification = new EligibleCategorySpecification(hierarchy);
    expect(
      await specification.isSatisfiedBy({
        categoryId: 'child',
        eligibleCategoryIds: ['parent'],
      }),
    ).toBe(true);
    expect(
      await specification.isSatisfiedBy({
        categoryId: 'other',
        eligibleCategoryIds: ['parent'],
      }),
    ).toBe(false);
  });
});
