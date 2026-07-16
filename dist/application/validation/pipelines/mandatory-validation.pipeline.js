"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MandatoryValidationPipeline = void 0;
const existence_rule_1 = require("../rules/mandatory/existence.rule");
const vigencia_rule_1 = require("../rules/mandatory/vigencia.rule");
const estado_activo_rule_1 = require("../rules/mandatory/estado-activo.rule");
class MandatoryValidationPipeline {
    chainHead;
    constructor(promoRepo) {
        const existence = new existence_rule_1.ExistenceRule(promoRepo);
        const vigencia = new vigencia_rule_1.VigenciaRule();
        const estadoActivo = new estado_activo_rule_1.EstadoActivoRule();
        existence.setNext(vigencia).setNext(estadoActivo);
        this.chainHead = existence;
    }
    async execute(context) {
        return this.chainHead.handle(context);
    }
}
exports.MandatoryValidationPipeline = MandatoryValidationPipeline;
//# sourceMappingURL=mandatory-validation.pipeline.js.map