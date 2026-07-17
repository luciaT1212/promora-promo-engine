import { ICategoryHierarchyRepository } from '../../../domain/interfaces/category-hierarchy.repository';

export class InMemoryCategoryHierarchyRepository implements ICategoryHierarchyRepository {
  private readonly parents = new Map<string, string | null>();
  add(categoryId: string, parentId: string | null = null): void {
    this.parents.set(categoryId, parentId);
  }
  async isSameOrDescendant(
    categoryId: string,
    ancestorId: string,
  ): Promise<boolean> {
    const seen = new Set<string>();
    let current: string | null | undefined = categoryId;
    while (current != null && !seen.has(current)) {
      if (current === ancestorId) return true;
      seen.add(current);
      current = this.parents.get(current);
    }
    return false;
  }
  clear(): void {
    this.parents.clear();
  }
}
