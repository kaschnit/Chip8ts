export class ProgramCounter {
    #value: number;
    readonly #instrSize: number;

    constructor(initial: number, stepSize: number) {
        this.#value = initial;
        this.#instrSize = stepSize;
    }

    jump(address: number): void {
        this.#value = address;
    }

    increment(): void {
        this.#value += this.#instrSize;
    }

    public get instructionSize(): number {
        return this.#instrSize;
    }

    public get value(): number {
        return this.#value;
    }
}
