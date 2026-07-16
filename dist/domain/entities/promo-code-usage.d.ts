export declare class PromoCodeUsage {
    readonly id: string;
    readonly promoCodeId: string;
    readonly orderId: string;
    readonly buyerId: string;
    readonly discountAmount: number;
    readonly isPaid: boolean;
    readonly createdAt: Date;
    constructor(id: string, promoCodeId: string, orderId: string, buyerId: string, discountAmount: number, isPaid: boolean, createdAt?: Date);
}
