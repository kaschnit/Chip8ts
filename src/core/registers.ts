export class Registers {
    private _regs: Uint8Array;

    public constructor(numRegisters: number) {
        this._regs = new Uint8Array(numRegisters).fill(0);
    }

    public get(r: number): number {
        return this._regs[r];
    }

    public set(r: number, value: number): void {
        this._regs[r] = value;
    }
}
