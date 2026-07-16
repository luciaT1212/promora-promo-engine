"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderFactory = void 0;
const uuid_1 = require("uuid");
const order_1 = require("../../domain/entities/order");
const order_context_1 = require("../../domain/value-objects/order-context");
const buyer_factory_1 = require("./buyer.factory");
class OrderFactory {
    static create(overrides = {}) {
        const buyer = overrides.buyer ?? buyer_factory_1.BuyerFactory.create();
        const context = new order_context_1.OrderContext(buyer, overrides.categoryId ?? 'cat-default', overrides.currentOrders ?? []);
        return new order_1.Order(overrides.id ?? (0, uuid_1.v4)(), overrides.subtotal ?? 100, context);
    }
}
exports.OrderFactory = OrderFactory;
//# sourceMappingURL=order.factory.js.map