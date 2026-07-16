"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
class Money {
    _amount;
    constructor(amount) {
        if (amount < 0) {
            throw new Error('Money amount cannot be negative');
        }
        this._amount = this.round(amount);
    }
    get amount() {
        return this._amount;
    }
    add(other) {
        return new Money(this._amount + other._amount);
    }
    subtract(other) {
        const result = this._amount - other._amount;
        return new Money(result < 0 ? 0 : result);
    }
    multiply(factor) {
        return new Money(this._amount * factor);
    }
    isGreaterThan(other) {
        return this._amount > other._amount;
    }
    isLessThan(other) {
        return this._amount < other._amount;
    }
    equals(other) {
        return this._amount === other._amount;
    }
    static zero() {
        return new Money(0);
    }
    static min(a, b) {
        return a.isLessThan(b) ? a : b;
    }
    round(value) {
        return Math.round(value * 100) / 100;
    }
}
exports.Money = Money;
//# sourceMappingURL=money.js.map