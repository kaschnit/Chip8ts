import * as React from "react";
declare type Props = {
    width: number;
    height: number;
    graphics?: Uint8Array;
    scale?: number;
};
export declare class MonochromeDisplay extends React.Component<Props> {
    private container;
    private controller;
    constructor(props: Props);
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): React.ReactNode;
}
export {};
