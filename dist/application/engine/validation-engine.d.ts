import { MandatoryValidationPipeline } from '../validation/pipelines/mandatory-validation.pipeline';
import { DynamicValidationPipeline } from '../validation/pipelines/dynamic-validation.pipeline';
import { ValidationContext } from '../../domain/value-objects/validation-context';
import { ValidationResult } from '../../domain/value-objects/validation-result';
export declare class ValidationEngine {
    private readonly mandatoryPipeline;
    private readonly dynamicPipeline;
    constructor(mandatoryPipeline: MandatoryValidationPipeline, dynamicPipeline: DynamicValidationPipeline);
    validate(context: ValidationContext): Promise<ValidationResult>;
}
