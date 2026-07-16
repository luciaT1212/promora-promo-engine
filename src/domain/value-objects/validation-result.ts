import { ErrorCode } from '../errors/error-codes';

export class ValidationResult {
  private _isValid: boolean;
  private readonly _errors: ErrorCode[];

  private constructor(isValid: boolean, errors: ErrorCode[] = []) {
    this._isValid = isValid;
    this._errors = errors;
  }

  get isValid(): boolean {
    return this._isValid;
  }

  get errors(): readonly ErrorCode[] {
    return this._errors;
  }

  get firstError(): ErrorCode | null {
    return this._errors.length > 0 ? this._errors[0] : null;
  }

  addError(code: ErrorCode): void {
    this._errors.push(code);
    this._isValid = false;
  }

  static success(): ValidationResult {
    return new ValidationResult(true, []);
  }

  static failure(code: ErrorCode): ValidationResult {
    return new ValidationResult(false, [code]);
  }
}
