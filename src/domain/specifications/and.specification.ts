import { Specification } from './specification';

export class AndSpecification<T> implements Specification<T> {
  constructor(
    private readonly left: Specification<T>,
    private readonly right: Specification<T>,
  ) {}
  async isSatisfiedBy(candidate: T): Promise<boolean> {
    return (
      (await this.left.isSatisfiedBy(candidate)) &&
      (await this.right.isSatisfiedBy(candidate))
    );
  }
}
