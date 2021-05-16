import { removeChildren } from "../../../util/utils";

export type SizeParams = {
    width: number;
    height: number;
    scale?: number;
}

export type MonochromeDisplayParams = SizeParams & {
    container: HTMLElement;
};

export class MonochromeDisplayController {
    private _display: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _scale: number;
    private _unscaledWidth: number;

    public constructor({ container, width, height, scale = 1 }: MonochromeDisplayParams) {
        // Remove all children of container so the canvas is the only thing present.
        // Stops multiple canvases from being rendered by one instance, leaving unreferenced canvases.
        removeChildren(container);

        this._scale = scale;
        this._display = document.createElement("canvas");
        this._display.width = width * scale;
        this._display.height = height * scale;
        this._unscaledWidth = width;

        this._ctx = this._display.getContext("2d")!;

        container.appendChild(this._display);
    }

    public get scale(): number {
        return this._scale;
    }

    public draw(graphics: Uint8Array | undefined): void {
        const { width, height } = this._display;

        if (graphics === undefined) {
            this._ctx.clearRect(0, 0, width, height);
            return;
        }

        const imgData = this._ctx.getImageData(0, 0, width, height);
        const pixels = imgData.data;

        let px = 0;
        let widthIndex = 0;
        let rowCopy = 0;
        for (let i = 0; i < graphics.length; ++i) {
            for (let j = 0; j < this._scale; ++j) {
                if (graphics[i]) {
                    pixels[px++] = 200;
                    pixels[px++] = 200;
                    pixels[px++] = 200;
                } else {
                    pixels[px++] = 0;
                    pixels[px++] = 0;
                    pixels[px++] = 0;
                }
                pixels[px++] = 255;
            }
            if (++widthIndex === this._unscaledWidth) {
                widthIndex = 0;
                if (++rowCopy < this._scale) {
                    i -= this._unscaledWidth;
                } else {
                    rowCopy = 0;
                }
            }
        }
        this._ctx.putImageData(imgData, 0, 0);
    }
}
