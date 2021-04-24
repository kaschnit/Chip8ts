export class Graphics {
    #width: number;
    #height: number;

    public constructor(width: number, height: number) {
        this.#width = width;
        this.#height = height;
    }

    public get height(): number {
        return this.#height;
    }

    public get width(): number {
        return this.#width;
    }
}
