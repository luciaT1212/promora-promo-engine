import { IBuyerRepository } from '../../../domain/interfaces/buyer.repository';
import { BuyerProfile } from '../../../domain/entities/buyer-profile';
export declare class InMemoryBuyerRepository implements IBuyerRepository {
    private readonly store;
    findById(buyerId: string): Promise<BuyerProfile | null>;
    save(profile: BuyerProfile): Promise<void>;
    clear(): void;
}
