export declare class Graphics {
    private _graphics;
    private _width;
    private _height;
    private _dirty;
    constructor(width: number, height: number);
    get height(): number;
    get width(): number;
    get dirty(): boolean;
    getRaw(): Uint8Array;
    clear(): void;
    get(x: number, y: number): number;
    flip(x: number, y: number): void;
    setClean(): void;
    private toIndex;
}
