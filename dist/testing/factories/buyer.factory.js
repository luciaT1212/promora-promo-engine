"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyerFactory = void 0;
const uuid_1 = require("uuid");
const buyer_profile_1 = require("../../domain/entities/buyer-profile");
class BuyerFactory {
    static create(overrides = {}) {
        return new buyer_profile_1.BuyerProfile(overrides.buyerId ?? (0, uuid_1.v4)(), overrides.totalOrders ?? 0, overrides.isFirstBuyer ?? (overrides.totalOrders ?? 0) === 0);
    }
    static firstBuyer() {
        return this.create({ totalOrders: 0, isFirstBuyer: true });
    }
    static withHistory(totalOrders) {
        return this.create({ totalOrders, isFirstBuyer: false });
    }
}
exports.BuyerFactory = BuyerFactory;
//# sourceMappingURL=buyer.factory.js.map