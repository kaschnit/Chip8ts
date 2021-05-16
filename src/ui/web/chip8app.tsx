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
import { MonochromeDisplayController } from "../display/monochromeDisplayController";

type Props = Record<string, never>;
type State = {
    romFile: File | undefined;
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

export class Chip8App extends React.Component<Props, State> {
    private chip8: Chip8;
    private displayController: MonochromeDisplayController | undefined;
    private runInterval: ReturnType<typeof setInterval> | undefined;

    public constructor(props: Props) {
        super(props);

        this.state = {
            romFile: undefined,
        };

        this.runInterval = undefined;

        this.chip8 = createChip8();
    }

    public handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const romFile: File | undefined = (e?.target?.files ?? [undefined])[0];
        this.setState({ romFile });
    }

    public async startEmulator(): Promise<void> {
        if (this.state.romFile === undefined) {
            return;
        }
        if (this.runInterval !== undefined) {
            clearInterval(this.runInterval);
        }

        this.chip8 = createChip8();

        await this.chip8.loadRom(this.state.romFile);
        const msDelay = 1000 / CYCLE_HZ;
        this.runInterval = setInterval(() => {
            this.chip8.runCycle();
            if (this.chip8.graphics.dirty) {
                this.displayController?.draw(this.chip8.graphics.getRaw());
            }
        }, msDelay);
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                            this.handleFileChange(e)
                        }
                    />
                </div>
                <div>
                    {this.state.romFile !== undefined && (
                        <button
                            className="rom-start-button"
                            onClick={(): Promise<void> => this.startEmulator()}
                        >
                            Start ROM
                        </button>
                    )}
                </div>
                <div
                    ref={(ref): void => {
                        if (this.displayController === undefined && ref !== null) {
                            this.displayController = new MonochromeDisplayController({
                                width: this.chip8.graphics.width,
                                height: this.chip8.graphics.height,
                                container: ref,
                                scale: 5,
                            });
                        }
                    }}
                />
            </div>
        );
    }
}
