export declare class Registers {
    private _regs;
    constructor(numRegisters: number);
    get(r: number): number;
    set(r: number, value: number): void;
}
