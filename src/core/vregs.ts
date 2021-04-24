export class VRegisters {
    #vregs: Uint8Array;

    public constructor(numRegisters: number) {
        this.#vregs = new Uint8Array(numRegisters).fill(0);
    }

    public get(r: number): number {
        return this.#vregs[r];
    }

    public set(r: number, value: number): void {
        this.#vregs[r] = value;
    }
}
