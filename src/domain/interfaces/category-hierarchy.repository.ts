export interface ICategoryHierarchyRepository {
  isSameOrDescendant(categoryId: string, ancestorId: string): Promise<boolean>;
}
