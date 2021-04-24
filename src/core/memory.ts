export class Memory {
    #mem: Uint8Array;

    public constructor(size: number) {
        this.#mem = new Uint8Array(size).fill(0);
    }

    public size(): number {
        return this.#mem.length;
    }

    public load8(address: number): number {
        return this.#mem[address];
    }

    public load16(address: number): number {
        return ((this.#mem[address] << 8) | (this.#mem[address + 1] & 0xff)) & 0xffff;
    }

    public store8(address: number, value: number): void {
        this.#mem[address] = value;
    }

    public write(address: number, values: Uint8Array): void {
        for (let i: number = 0; i < values.length; ++i) {
            this.#mem[address + i] = values[i];
        }
    }
}
