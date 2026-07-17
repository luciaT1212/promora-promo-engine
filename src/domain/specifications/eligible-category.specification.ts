import { ICategoryHierarchyRepository } from '../interfaces/category-hierarchy.repository';
import { Specification } from './specification';

export interface EligibleCategoryCandidate {
  categoryId: string;
  eligibleCategoryIds: readonly string[];
}

export class EligibleCategorySpecification implements Specification<EligibleCategoryCandidate> {
  constructor(private readonly hierarchy?: ICategoryHierarchyRepository) {}
  async isSatisfiedBy(candidate: EligibleCategoryCandidate): Promise<boolean> {
    const matches = await Promise.all(
      candidate.eligibleCategoryIds.map((id) =>
        this.hierarchy
          ? this.hierarchy.isSameOrDescendant(candidate.categoryId, id)
          : Promise.resolve(candidate.categoryId === id),
      ),
    );
    return matches.some(Boolean);
  }
}
