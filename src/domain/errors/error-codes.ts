/**
 * Códigos de error semánticos del motor de códigos promocionales.
 * TDR sección 7 - Manejo de Errores.
 */
export enum ErrorCode {
  INVALID_CODE = 'invalid_code',
  EXPIRED_COUPON = 'expired_coupon',
  USAGE_LIMIT_REACHED = 'usage_limit_reached',
  MAXIMUM_DISCOUNT_REACHED = 'maximum_discount_reached',
  MIN_AMOUNT_REQUIRED = 'min_amount_required',
  CODE_ALREADY_USED = 'code_already_used',
  RESTRICTED_USAGE = 'restricted_usage',
}
