"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
class Order {
    id;
    subtotal;
    context;
    constructor(id, subtotal, context) {
        this.id = id;
        this.subtotal = subtotal;
        this.context = context;
    }
    getSubtotal() {
        return this.subtotal;
    }
    getOrderContext() {
        return this.context;
    }
}
exports.Order = Order;
//# sourceMappingURL=order.js.map