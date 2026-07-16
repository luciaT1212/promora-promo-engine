"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCalcRule = void 0;
class PostCalcRule {
    ruleType;
    parameters;
    isActive;
    constructor(ruleType, parameters, isActive = true) {
        this.ruleType = ruleType;
        this.parameters = parameters;
        this.isActive = isActive;
    }
}
exports.PostCalcRule = PostCalcRule;
//# sourceMappingURL=post-calc-rule.js.map