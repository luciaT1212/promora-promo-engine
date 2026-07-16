export class Money {
  private readonly _amount: number;

  constructor(amount: number) {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    this._amount = this.round(amount);
  }

  get amount(): number {
    return this._amount;
  }

  add(other: Money): Money {
    return new Money(this._amount + other._amount);
  }

  subtract(other: Money): Money {
    const result = this._amount - other._amount;
    return new Money(result < 0 ? 0 : result);
  }

  multiply(factor: number): Money {
    return new Money(this._amount * factor);
  }

  isGreaterThan(other: Money): boolean {
    return this._amount > other._amount;
  }

  isLessThan(other: Money): boolean {
    return this._amount < other._amount;
  }

  equals(other: Money): boolean {
    return this._amount === other._amount;
  }

  static zero(): Money {
    return new Money(0);
  }

  static min(a: Money, b: Money): Money {
    return a.isLessThan(b) ? a : b;
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
