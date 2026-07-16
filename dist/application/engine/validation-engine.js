"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationEngine = void 0;
class ValidationEngine {
    mandatoryPipeline;
    dynamicPipeline;
    constructor(mandatoryPipeline, dynamicPipeline) {
        this.mandatoryPipeline = mandatoryPipeline;
        this.dynamicPipeline = dynamicPipeline;
    }
    async validate(context) {
        const mandatoryResult = await this.mandatoryPipeline.execute(context);
        if (!mandatoryResult.isValid)
            return mandatoryResult;
        return this.dynamicPipeline.execute(context, context.promo);
    }
}
exports.ValidationEngine = ValidationEngine;
//# sourceMappingURL=validation-engine.js.map