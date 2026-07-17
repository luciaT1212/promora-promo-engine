export class DuplicatePromoUsageError extends Error {
  constructor() {
    super('La orden ya tiene registrado este código promocional');
  }
}
