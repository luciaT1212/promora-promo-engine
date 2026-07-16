import { IRestrictedUserRepository } from '../../../domain/interfaces/restricted-user.repository';
export declare class InMemoryRestrictedUserRepository implements IRestrictedUserRepository {
    private readonly store;
    isBuyerAuthorized(promoCodeId: string, buyerId: string): Promise<boolean>;
    authorize(promoCodeId: string, buyerId: string): Promise<void>;
    clear(): void;
}
