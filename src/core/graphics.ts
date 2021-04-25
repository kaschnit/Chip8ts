export class Graphics {
    private _graphics: Uint8Array;
    private _width: number;
    private _height: number;
    private _dirty: boolean;

    public constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this._graphics = new Uint8Array(width * height).fill(0);
        this._dirty = false;
    }

    public get height(): number {
        return this._height;
    }

    public get width(): number {
        return this._width;
    }

    public get dirty(): boolean {
        return this._dirty;
    }

    public clear(): void {
        for (let i = 0; i < this._graphics.length; ++i) {
            this._graphics[i] = 0;
        }
        this._dirty = true;
    }

    public get(x: number, y: number): number {
        return this._graphics[this.toIndex(x, y)];
    }

    public flip(x: number, y: number): void {
        this._graphics[this.toIndex(x, y)] ^= 1;
        this._dirty = true;
    }

    public setClean(): void {
        this._dirty = false;
    }

    private toIndex(x: number, y: number): number {
        return y * this._width + x;
    }
}
