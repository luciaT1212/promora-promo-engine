export class TierConfiguration {
  constructor(
    public readonly minOrders: number,
    public readonly discountPercent: number,
  ) {}
}
