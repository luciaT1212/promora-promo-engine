export class ValidatePromoRequestDto {
  code!: string;
  orderId!: string;
  subtotal!: number;
  categoryId!: string;
  currentOrders?: string[];
  buyer!: {
    buyerId: string;
    totalOrders: number;
    isFirstBuyer: boolean;
  };
}

export interface ValidatePromoResponseDto {
  valid: boolean;
  errorCode?: string;
  discount?: {
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
  };
}
