import { removeChildren } from "../../util/utils";

export type MonochromeDisplayParams = {
    container: HTMLElement;
    width: number;
    height: number;
    scale?: number;
};

export class MonochromeDisplayController {
    private _display: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _scale: number;

    public constructor({ container, width, height, scale = 1 }: MonochromeDisplayParams) {
        // Remove all children of container so the canvas is the only thing present.
        // Stops multiple canvases from being rendered by one instance, leaving unreferenced canvases.
        removeChildren(container);

        this._scale = scale;
        this._display = document.createElement("canvas");
        this._display.width = width * scale;
        this._display.height = height * scale;

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
        for (let i = 0; i < graphics.length; ++i) {
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
        this._ctx.putImageData(imgData, 0, 0);
    }
}
