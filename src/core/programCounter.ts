export class ProgramCounter {
    private _value: number;
    private readonly _initial: number;
    private readonly _instrSize: number;

    public constructor(initial: number, stepSize: number) {
        this._value = initial;
        this._initial = initial;
        this._instrSize = stepSize;
    }

    public jump(address: number): void {
        this._value = address;
    }

    public increment(): void {
        this._value += this._instrSize;
    }

    public get instructionSize(): number {
        return this._instrSize;
    }

    public get value(): number {
        return this._value;
    }

    public get initial(): number {
        return this._initial;
    }
}
