import * as React from "react";
import { Memory } from "../../core/memory";
import { Chip8 } from "../../core/chip8";
import { Graphics } from "../../core/graphics";
import { Stack } from "../../core/stack";
import { ProgramCounter } from "../../core/programCounter";
import { Timer } from "../../core/timer";
import { Registers } from "../../core/registers";
import {
    DISPLAY_WIDTH,
    DISPLAY_HEIGHT,
    MEMORY_SIZE,
    STACK_SIZE,
    PC_START,
    INSTRUCTION_SIZE_BYTES,
    TIMER_HZ,
    NUM_REGS,
    KEYBOARD_MAPPING,
    CYCLE_HZ,
} from "../../util/constants";
import { range } from "../../util/utils";
import { MonochromeDisplayController } from "./display/monochromeDisplayController";

type Props = Record<string, never>;
type State = {
    romFile: File | undefined;
    scale: number;
    running: boolean;
};

function createChip8(): Chip8 {
    return new Chip8({
        memory: new Memory(MEMORY_SIZE),
        stack: new Stack(STACK_SIZE),
        pc: new ProgramCounter(PC_START, INSTRUCTION_SIZE_BYTES),
        graphics: new Graphics(DISPLAY_WIDTH, DISPLAY_HEIGHT),
        delayTimer: new Timer(TIMER_HZ),
        soundTimer: new Timer(TIMER_HZ, () => console.log("Playing beeping sound!")),
        vregs: new Registers(NUM_REGS),
        keyregs: new Registers(Object.keys(KEYBOARD_MAPPING).length),
    });
}

const CYCLE_MS_DELAY = 1000 / CYCLE_HZ;

export class Chip8App extends React.Component<Props, State> {
    private chip8: Chip8;
    private displayController: MonochromeDisplayController | undefined;
    private runInterval: ReturnType<typeof setInterval> | undefined;

    public constructor(props: Props) {
        super(props);

        this.state = {
            romFile: undefined,
            scale: 10,
            running: false,
        };

        this.runInterval = undefined;

        this.chip8 = createChip8();
    }

    private handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
        this.cleanUp();
        this.setState({
            romFile: (e?.currentTarget?.files ?? [undefined])[0],
            running: false,
        });
    }

    private async startStopEmulator(): Promise<void> {
        if (this.state.romFile === undefined || this.state.running) {
            this.cleanUp();
            this.setState({ running: false });
            return;
        }

        await this.chip8.loadRom(this.state.romFile);

        this.beginExecutionInterval();
    }

    private pauseUnpauseEmulator(): void {
        if (this.state.running) {
            this.stopExecutionInterval();
        } else {
            this.beginExecutionInterval();
        }
    }

    private stopExecutionInterval(): void {
        this.setState({ running: false });

        // clean up the old running interval
        if (this.runInterval !== undefined) {
            clearInterval(this.runInterval);
        }
    }

    private beginExecutionInterval(): void {
        // make sure no old interval running
        this.stopExecutionInterval();

        this.setState({ running: true });

        // begin running the system
        this.runInterval = setInterval(() => {
            this.chip8.runCycle();
            if (this.chip8.graphics.dirty) {
                this.displayController?.draw(this.chip8.graphics.getRaw());
            }
        }, CYCLE_MS_DELAY);
    }

    private cleanUp(): void {
        this.stopExecutionInterval();

        // reset the emulator state
        this.chip8 = createChip8();

        // clear the display
        this.displayController?.draw(this.chip8.graphics.getRaw());
    }

    private renderScaleSelector(): React.ReactNode {
        const options = [];
        for (let i = 1; i <= 20; ++i) {
            options.push(<option key={`scale-${i}`} value={i}>{i}</option>);
        }
        return (
            <>
                <label htmlFor="scale-selector">Upload a Chip8 ROM</label>{" "}
                <select
                    id="scale-selector"
                    name="scale-selector"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                        this.setState({ scale: parseInt(e.currentTarget.value) })
                    }}
                    value={this.state.scale}
                >
                    {Array.from(range(1, 21)).map((i) => <option key={`scale-${i}`} value={i}>{i}</option>)}
                </select>
            </>
        );
    }

    public componentDidUpdate(): void {
        this.displayController?.draw(this.chip8.graphics.getRaw());
    }

    public componentDidMount(): void {
        this.displayController?.draw(this.chip8.graphics.getRaw());
    }

    public render(): React.ReactNode {
        return (
            <div
                onKeyDown={(e): void => this.chip8.setKeyPress(KEYBOARD_MAPPING[e.key], true)}
                onKeyUp={(e): void => this.chip8.setKeyPress(KEYBOARD_MAPPING[e.key], false)}
                tabIndex={0}
            >
                <div>
                    <label htmlFor="rom-upload">Upload a Chip8 ROM</label>{" "}
                    <input
                        id="rom-upload"
                        name="rom-upload"
                        type="file"
                        disabled={this.state.running}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                            this.handleFileChange(e)
                        }
                    />
                </div>
                <div>
                    {this.renderScaleSelector()}
                </div>
                <div>
                    <button
                        disabled={this.state.romFile === undefined}
                        onClick={(): Promise<void> => this.startStopEmulator()}
                    >
                        {this.state.running ? "Stop" : "Start"} ROM
                    </button>
                    <button
                        disabled={this.state.romFile === undefined}
                        onClick={(): void => this.pauseUnpauseEmulator()}
                    >
                        {this.state.running ? "Pause" : "Unpause"}
                    </button>
                </div>
                <div
                    ref={(ref): void => {
                        if (ref !== null) {
                            this.displayController = new MonochromeDisplayController({
                                width: this.chip8.graphics.width,
                                height: this.chip8.graphics.height,
                                container: ref,
                                scale: this.state.scale,
                            });
                        }
                    }}
                />
            </div>
        );
    }
}
