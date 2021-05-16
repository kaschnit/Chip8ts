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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";

type Props = Record<string, never>;
type State = {
    romFile: File | undefined;
    scale: number;
    running: boolean;
    hasStarted: boolean;
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
            hasStarted: false,
        };

        this.runInterval = undefined;

        this.chip8 = createChip8();
    }

    private handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
        this.cleanUp();

        const romFile = (e?.currentTarget?.files ?? [undefined])[0];

        this.setState({
            romFile, 
            running: false,
        });

        if (romFile !== undefined) {
            this.startStopEmulator();
        }
    }

    private async startStopEmulator(): Promise<void> {
        if (this.state.romFile === undefined || this.state.hasStarted) {
            this.cleanUp();
            this.setState({ hasStarted: false });
            return;
        }

        await this.chip8.loadRom(this.state.romFile);

        this.setState({ hasStarted: true });

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
                    <label htmlFor="rom-upload">Upload a CHIP-8 ROM</label>{" "}
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
                    <label htmlFor="scale-selector">Scale</label>{" "}
                    <select
                        id="scale-selector"
                        name="scale-selector"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                            this.setState({ scale: parseInt(e.currentTarget.value) })
                        }}
                        value={this.state.scale}
                    >
                        {[...range(1, 21)].map((i) => <option key={`scale-${i}`} value={i}>{i}</option>)}
                    </select>
                </div>
                <div>
                    { this.state.hasStarted &&
                        <button
                            disabled={this.state.romFile === undefined}
                            onClick={(): void => this.pauseUnpauseEmulator()}
                        >
                            <FontAwesomeIcon icon={this.state.running ? faPause : faPlay}/>
                        </button>
                    }
                    <button
                        disabled={this.state.romFile === undefined}
                        onClick={(): Promise<void> => this.startStopEmulator()}
                    >
                        <FontAwesomeIcon icon={this.state.hasStarted ? faStop : faPlay}/>
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
