import { Specification } from './specification';

export interface FirstOrderCandidate {
  paidOrderCount: number;
}

export class FirstOrderSpecification implements Specification<FirstOrderCandidate> {
  isSatisfiedBy(candidate: FirstOrderCandidate): Promise<boolean> {
    return Promise.resolve(candidate.paidOrderCount === 0);
  }
}
