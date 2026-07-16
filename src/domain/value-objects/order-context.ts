import { BuyerProfile } from '../entities/buyer-profile';

export class OrderContext {
  constructor(
    public readonly buyerProfile: BuyerProfile,
    public readonly categoryId: string,
    public readonly currentOrders: readonly string[],
  ) {}
}
