import { BuyerProfile } from '../entities/buyer-profile';
export interface IBuyerRepository {
    findById(buyerId: string): Promise<BuyerProfile | null>;
    save(profile: BuyerProfile): Promise<void>;
}
