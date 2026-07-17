export enum DiscountType {
  FIXED = 'fixed',
  PERCENT = 'percent',
  TIERED = 'tiered',
}

export enum PromoStateType {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  EXPIRED = 'expired',
}

export enum RuleType {
  MIN_PURCHASE_AMOUNT = 'min_purchase_amount',
  ELIGIBLE_CATEGORIES = 'eligible_categories',
  FIRST_ORDER_ONLY = 'first_order_only',
  USER_USAGE_LIMIT = 'user_usage_limit',
  GLOBAL_USAGE_LIMIT = 'global_usage_limit',
  GLOBAL_AMOUNT_LIMIT = 'global_amount_limit',
  RESTRICTED_USAGE = 'restricted_usage',
}

export enum PostCalcRuleType {
  MAX_DISCOUNT_AMOUNT = 'max_discount_amount',
}
