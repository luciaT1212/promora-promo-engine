"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicValidationPipeline = void 0;
const validation_result_1 = require("../../../domain/value-objects/validation-result");
class DynamicValidationPipeline {
    ruleFactory;
    constructor(ruleFactory) {
        this.ruleFactory = ruleFactory;
    }
    async execute(context, promo) {
        const activeRules = promo.getActiveRules();
        if (activeRules.length === 0)
            return validation_result_1.ValidationResult.success();
        const ruleInstances = this.ruleFactory.createRules(activeRules.map((r) => r.ruleType));
        this.chain(ruleInstances);
        return ruleInstances[0].handle(context);
    }
    chain(rules) {
        for (let i = 0; i < rules.length - 1; i++) {
            rules[i].setNext(rules[i + 1]);
        }
    }
}
exports.DynamicValidationPipeline = DynamicValidationPipeline;
//# sourceMappingURL=dynamic-validation.pipeline.js.map