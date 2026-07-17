export class Money {
  private readonly cents: number;

  constructor(amount: number) {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error(
        'El monto debe ser un número finito mayor o igual a cero',
      );
    }
    this.cents = Math.round((amount + Number.EPSILON) * 100);
  }

  get amount(): number {
    return this.cents / 100;
  }

  add(other: Money): Money {
    return Money.fromCents(this.cents + other.cents);
  }

  subtract(other: Money): Money {
    return Money.fromCents(Math.max(0, this.cents - other.cents));
  }

  multiply(factor: number): Money {
    if (!Number.isFinite(factor) || factor < 0)
      throw new Error('El factor monetario debe ser mayor o igual a cero');
    return Money.fromCents(Math.round(this.cents * factor));
  }

  isGreaterThan(other: Money): boolean {
    return this.cents > other.cents;
  }

  isLessThan(other: Money): boolean {
    return this.cents < other.cents;
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }

  static zero(): Money {
    return new Money(0);
  }

  static min(a: Money, b: Money): Money {
    return a.isLessThan(b) ? a : b;
  }

  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents) || cents < 0)
      throw new Error('Los centavos deben ser un entero mayor o igual a cero');
    return new Money(cents / 100);
  }
}
