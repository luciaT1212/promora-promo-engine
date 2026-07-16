export interface IRestrictedUserRepository {
  isBuyerAuthorized(promoCodeId: string, buyerId: string): Promise<boolean>;
  authorize(promoCodeId: string, buyerId: string): Promise<void>;
}
