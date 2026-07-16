export class BuyerProfile {
  constructor(
    public readonly buyerId: string,
    public readonly totalOrders: number,
    public readonly isFirstBuyer: boolean,
  ) {}
}
