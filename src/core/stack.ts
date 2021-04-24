export class Stack {
    #mem: Uint16Array;
    #sp: number;

    public constructor(size: number) {
        this.#mem = new Uint16Array(size).fill(0);
        this.#sp = 0;
    }

    public push(val: number): void {
        this.#mem[this.#sp++] = val;
    }

    public pop(): number {
        return this.#mem[--this.#sp];
    }
}