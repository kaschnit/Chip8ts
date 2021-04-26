import * as React from "react";
import {
    MonochromeDisplayController,
    MonochromeDisplayParams,
} from "./monochromeDisplayController";

type Props = {
    width: number;
    height: number;
    graphics?: Uint8Array;
    scale?: number;
};

export class MonochromeDisplay extends React.Component<Props> {
    private container: HTMLElement | undefined;
    private controller: MonochromeDisplayController | undefined;

    public constructor(props: Props) {
        super(props);
        this.container = undefined;
        this.controller = undefined;
    }

    public componentDidMount(): void {
        if (this.controller === undefined && this.container !== undefined) {
            const params: MonochromeDisplayParams = {
                width: this.props.width,
                height: this.props.height,
                container: this.container,
            };
            if (this.props.scale !== undefined) {
                params.scale = this.props.scale;
            }
            this.controller = new MonochromeDisplayController(params);
        }
        this.controller?.draw(this.props.graphics);
    }

    public componentDidUpdate(): void {
        this.controller?.draw(this.props.graphics);
    }

    public render(): React.ReactNode {
        return (
            <div
                ref={(ref): void => {
                    this.container = ref ?? undefined;
                }}
            />
        );
    }
}
