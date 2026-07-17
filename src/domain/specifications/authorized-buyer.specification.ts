import { IRestrictedUserRepository } from '../interfaces/restricted-user.repository';
import { Specification } from './specification';

export interface AuthorizedBuyerCandidate {
  promoCodeId: string;
  buyerId: string;
}

export class AuthorizedBuyerSpecification implements Specification<AuthorizedBuyerCandidate> {
  constructor(private readonly repository: IRestrictedUserRepository) {}
  isSatisfiedBy(candidate: AuthorizedBuyerCandidate): Promise<boolean> {
    return this.repository.isBuyerAuthorized(
      candidate.promoCodeId,
      candidate.buyerId,
    );
  }
}
