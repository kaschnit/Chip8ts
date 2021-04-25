export class Stack {
    private _mem: Uint16Array;
    private _sp: number;

    public constructor(size: number) {
        this._mem = new Uint16Array(size).fill(0);
        this._sp = 0;
    }

    public push(val: number): void {
        this._mem[this._sp++] = val;
    }

    public pop(): number {
        return this._mem[--this._sp];
    }

    public size(): number {
        return this._mem.length;   
    }
}