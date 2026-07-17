import { Specification } from './specification';

export class NotSpecification<T> implements Specification<T> {
  constructor(private readonly inner: Specification<T>) {}
  async isSatisfiedBy(candidate: T): Promise<boolean> {
    return !(await this.inner.isSatisfiedBy(candidate));
  }
}
