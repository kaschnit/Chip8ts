export declare type SizeParams = {
    width: number;
    height: number;
    scale?: number;
};
export declare type MonochromeDisplayParams = SizeParams & {
    container: HTMLElement;
};
export declare class MonochromeDisplayController {
    private _display;
    private _ctx;
    private _scale;
    private _unscaledWidth;
    constructor({ container, width, height, scale }: MonochromeDisplayParams);
    get scale(): number;
    draw(graphics: Uint8Array | undefined): void;
}
