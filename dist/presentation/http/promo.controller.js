"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoController = void 0;
const common_1 = require("@nestjs/common");
const validate_promo_dto_1 = require("./dto/validate-promo.dto");
const promo_engine_provider_1 = require("./promo-engine.provider");
const buyer_profile_1 = require("../../domain/entities/buyer-profile");
const order_context_1 = require("../../domain/value-objects/order-context");
const order_1 = require("../../domain/entities/order");
let PromoController = class PromoController {
    provider = new promo_engine_provider_1.PromoEngineProvider();
    async validate(body) {
        const buyer = new buyer_profile_1.BuyerProfile(body.buyer.buyerId, body.buyer.totalOrders, body.buyer.isFirstBuyer);
        const context = new order_context_1.OrderContext(buyer, body.categoryId, body.currentOrders ?? []);
        const order = new order_1.Order(body.orderId, body.subtotal, context);
        const result = await this.provider.engine.validateAndCalculate(body.code, order, buyer);
        if (!result.validation.isValid) {
            return {
                valid: false,
                errorCode: result.validation.firstError ?? undefined,
            };
        }
        return {
            valid: true,
            discount: result.calculation,
        };
    }
};
exports.PromoController = PromoController;
__decorate([
    (0, common_1.Post)('validate'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof validate_promo_dto_1.ValidatePromoRequestDto !== "undefined" && validate_promo_dto_1.ValidatePromoRequestDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], PromoController.prototype, "validate", null);
exports.PromoController = PromoController = __decorate([
    (0, common_1.Controller)('api/promo')
], PromoController);
//# sourceMappingURL=promo.controller.js.map