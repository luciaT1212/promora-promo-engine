export declare class Money {
    private readonly _amount;
    constructor(amount: number);
    get amount(): number;
    add(other: Money): Money;
    subtract(other: Money): Money;
    multiply(factor: number): Money;
    isGreaterThan(other: Money): boolean;
    isLessThan(other: Money): boolean;
    equals(other: Money): boolean;
    static zero(): Money;
    static min(a: Money, b: Money): Money;
    private round;
}
