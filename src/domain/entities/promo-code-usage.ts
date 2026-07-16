export class PromoCodeUsage {
  constructor(
    public readonly id: string,
    public readonly promoCodeId: string,
    public readonly orderId: string,
    public readonly buyerId: string,
    public readonly discountAmount: number,
    public readonly isPaid: boolean,
    public readonly createdAt: Date = new Date(),
  ) {}
}
