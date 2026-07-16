"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCalcRuleType = exports.RuleType = exports.PromoState = exports.DiscountType = void 0;
var DiscountType;
(function (DiscountType) {
    DiscountType["FIXED"] = "fixed";
    DiscountType["PERCENT"] = "percent";
    DiscountType["TIERED"] = "tiered";
})(DiscountType || (exports.DiscountType = DiscountType = {}));
var PromoState;
(function (PromoState) {
    PromoState["DRAFT"] = "draft";
    PromoState["ACTIVE"] = "active";
    PromoState["PAUSED"] = "paused";
    PromoState["EXPIRED"] = "expired";
})(PromoState || (exports.PromoState = PromoState = {}));
var RuleType;
(function (RuleType) {
    RuleType["MIN_PURCHASE_AMOUNT"] = "min_purchase_amount";
    RuleType["ELIGIBLE_CATEGORIES"] = "eligible_categories";
    RuleType["FIRST_ORDER_ONLY"] = "first_order_only";
    RuleType["USER_USAGE_LIMIT"] = "user_usage_limit";
    RuleType["GLOBAL_USAGE_LIMIT"] = "global_usage_limit";
    RuleType["GLOBAL_AMOUNT_LIMIT"] = "global_amount_limit";
    RuleType["RESTRICTED_USAGE"] = "restricted_usage";
})(RuleType || (exports.RuleType = RuleType = {}));
var PostCalcRuleType;
(function (PostCalcRuleType) {
    PostCalcRuleType["MAX_DISCOUNT_AMOUNT"] = "max_discount_amount";
})(PostCalcRuleType || (exports.PostCalcRuleType = PostCalcRuleType = {}));
//# sourceMappingURL=promo-code.types.js.map