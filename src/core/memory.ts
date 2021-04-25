export class Memory {
    private _mem: Uint8Array;

    public constructor(size: number) {
        this._mem = new Uint8Array(size).fill(0);
    }

    public size(): number {
        return this._mem.length;
    }

    public load8(address: number): number {
        return this._mem[address];
    }

    public load16(address: number): number {
        return ((this._mem[address] << 8) | (this._mem[address + 1] & 0xff)) & 0xffff;
    }

    public store8(address: number, value: number): void {
        this._mem[address] = value;
    }

    public write(address: number, values: Uint8Array): void {
        for (let i = 0; i < values.length; ++i) {
            this._mem[address + i] = values[i];
        }
    }
}
