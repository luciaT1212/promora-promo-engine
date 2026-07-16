"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationContext = void 0;
class ValidationContext {
    promoCodeString;
    order;
    buyer;
    promo;
    constructor(promoCodeString, order, buyer, promo = null) {
        this.promoCodeString = promoCodeString;
        this.order = order;
        this.buyer = buyer;
        this.promo = promo;
    }
}
exports.ValidationContext = ValidationContext;
//# sourceMappingURL=validation-context.js.map