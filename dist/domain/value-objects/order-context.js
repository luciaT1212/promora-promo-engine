"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderContext = void 0;
class OrderContext {
    buyerProfile;
    categoryId;
    currentOrders;
    constructor(buyerProfile, categoryId, currentOrders) {
        this.buyerProfile = buyerProfile;
        this.categoryId = categoryId;
        this.currentOrders = currentOrders;
    }
}
exports.OrderContext = OrderContext;
//# sourceMappingURL=order-context.js.map