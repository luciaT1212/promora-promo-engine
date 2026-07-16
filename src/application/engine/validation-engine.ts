import { MandatoryValidationPipeline } from '../validation/pipelines/mandatory-validation.pipeline';
import { DynamicValidationPipeline } from '../validation/pipelines/dynamic-validation.pipeline';
import { ValidationContext } from '../../domain/value-objects/validation-context';
import { ValidationResult } from '../../domain/value-objects/validation-result';

/**
 * Orquesta ambos pipelines de validacion. ASD - "ValidationEngine".
 * Corre mandatorio primero (orden estricto TDR seccion 2); si pasa,
 * corre el dinamico (reglas configurables del codigo).
 */
export class ValidationEngine {
  constructor(
    private readonly mandatoryPipeline: MandatoryValidationPipeline,
    private readonly dynamicPipeline: DynamicValidationPipeline,
  ) {}

  async validate(context: ValidationContext): Promise<ValidationResult> {
    const mandatoryResult = await this.mandatoryPipeline.execute(context);
    if (!mandatoryResult.isValid) return mandatoryResult;

    // Aca context.promo ya fue cargado por ExistenceRule
    return this.dynamicPipeline.execute(context, context.promo!);
  }
}
