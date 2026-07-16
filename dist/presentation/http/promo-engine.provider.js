"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoEngineProvider = void 0;
const promo_code_engine_1 = require("../../application/engine/promo-code-engine");
const validation_engine_1 = require("../../application/engine/validation-engine");
const mandatory_validation_pipeline_1 = require("../../application/validation/pipelines/mandatory-validation.pipeline");
const dynamic_validation_pipeline_1 = require("../../application/validation/pipelines/dynamic-validation.pipeline");
const validation_rule_factory_1 = require("../../application/factories/validation-rule.factory");
const discount_strategy_factory_1 = require("../../application/factories/discount-strategy.factory");
const discount_calculator_1 = require("../../application/calculation/discount-calculator");
const in_memory_promo_code_repository_1 = require("../../infrastructure/repositories/in-memory/in-memory-promo-code.repository");
const in_memory_usage_repository_1 = require("../../infrastructure/repositories/in-memory/in-memory-usage.repository");
const in_memory_restricted_user_repository_1 = require("../../infrastructure/repositories/in-memory/in-memory-restricted-user.repository");
const promo_code_factory_1 = require("../../testing/factories/promo-code.factory");
const rule_factory_1 = require("../../testing/factories/rule.factory");
const tier_configuration_1 = require("../../domain/entities/tier-configuration");
class PromoEngineProvider {
    promoRepo = new in_memory_promo_code_repository_1.InMemoryPromoCodeRepository();
    usageRepo = new in_memory_usage_repository_1.InMemoryPromoCodeUsageRepository();
    restrictedRepo = new in_memory_restricted_user_repository_1.InMemoryRestrictedUserRepository();
    engine;
    constructor() {
        const mandatory = new mandatory_validation_pipeline_1.MandatoryValidationPipeline(this.promoRepo);
        const ruleFactory = new validation_rule_factory_1.ValidationRuleFactory(this.usageRepo, this.restrictedRepo);
        const dynamic = new dynamic_validation_pipeline_1.DynamicValidationPipeline(ruleFactory);
        const validationEngine = new validation_engine_1.ValidationEngine(mandatory, dynamic);
        const calculator = new discount_calculator_1.DiscountCalculator(new discount_strategy_factory_1.DiscountStrategyFactory());
        this.engine = new promo_code_engine_1.PromoCodeEngine(validationEngine, calculator, this.usageRepo);
        this.seedExamples();
    }
    async seedExamples() {
        await this.promoRepo.save(promo_code_factory_1.PromoCodeFactory.percent(15, { code: 'SUMMER15' }));
        await this.promoRepo.save(promo_code_factory_1.PromoCodeFactory.percent(10, {
            code: 'FIRST10',
            rules: [rule_factory_1.RuleFactory.firstOrderOnly(), rule_factory_1.RuleFactory.minPurchase(50)],
        }));
        await this.promoRepo.save(promo_code_factory_1.PromoCodeFactory.fixed(20, { code: 'FLAT20' }));
        await this.promoRepo.save(promo_code_factory_1.PromoCodeFactory.tiered([
            new tier_configuration_1.TierConfiguration(0, 5),
            new tier_configuration_1.TierConfiguration(3, 10),
            new tier_configuration_1.TierConfiguration(10, 15),
        ], { code: 'VIP' }));
        await this.promoRepo.save(promo_code_factory_1.PromoCodeFactory.percent(50, {
            code: 'CAPPED50',
            postCalcRules: [rule_factory_1.RuleFactory.maxDiscount(30)],
        }));
    }
}
exports.PromoEngineProvider = PromoEngineProvider;
//# sourceMappingURL=promo-engine.provider.js.map