export class VRegisters {
    private _vregs: Uint8Array;

    public constructor(numRegisters: number) {
        this._vregs = new Uint8Array(numRegisters).fill(0);
    }

    public get(r: number): number {
        return this._vregs[r];
    }

    public set(r: number, value: number): void {
        this._vregs[r] = value;
    }
}
