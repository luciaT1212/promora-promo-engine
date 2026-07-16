import { ErrorCode } from '../errors/error-codes';
export declare class ValidationResult {
    private _isValid;
    private readonly _errors;
    private constructor();
    get isValid(): boolean;
    get errors(): readonly ErrorCode[];
    get firstError(): ErrorCode | null;
    addError(code: ErrorCode): void;
    static success(): ValidationResult;
    static failure(code: ErrorCode): ValidationResult;
}
