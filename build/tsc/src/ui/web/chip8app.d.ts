import * as React from "react";
import "./chip8app.scss";
declare type Props = Record<string, never>;
declare type State = {
    romFile: File | undefined;
    scale: number;
    running: boolean;
    hasStarted: boolean;
};
export declare class Chip8App extends React.Component<Props, State> {
    private chip8;
    private displayController;
    private runInterval;
    constructor(props: Props);
    private handleFileChange;
    private startStopEmulator;
    private pauseUnpauseEmulator;
    private stopExecutionInterval;
    private beginExecutionInterval;
    private cleanUp;
    componentDidUpdate(): void;
    componentDidMount(): void;
    render(): React.ReactNode;
}
export {};
