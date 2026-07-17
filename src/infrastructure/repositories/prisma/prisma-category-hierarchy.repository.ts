import { ICategoryHierarchyRepository } from '../../../domain/interfaces/category-hierarchy.repository';
import { PrismaService } from '../../prisma/prisma.service';

export class PrismaCategoryHierarchyRepository implements ICategoryHierarchyRepository {
  constructor(private readonly prisma: PrismaService) {}
  async isSameOrDescendant(
    categoryId: string,
    ancestorId: string,
  ): Promise<boolean> {
    const seen = new Set<string>();
    let current: string | null = categoryId;
    while (current && !seen.has(current)) {
      if (current === ancestorId) return true;
      seen.add(current);
      current =
        (
          await this.prisma.category.findUnique({
            where: { id: current },
            select: { parentId: true },
          })
        )?.parentId ?? null;
    }
    return false;
  }
}
