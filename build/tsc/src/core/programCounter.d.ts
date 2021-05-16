export declare class ProgramCounter {
    private _value;
    private readonly _initial;
    private readonly _instrSize;
    constructor(initial: number, stepSize: number);
    jump(address: number): void;
    increment(): void;
    get instructionSize(): number;
    get value(): number;
    get initial(): number;
}
