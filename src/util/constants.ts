import { KeyboardMapper } from "../ui/keyboard";

export const MEMORY_SIZE = 4096 as const; // number of bytes available in memory
export const STACK_SIZE = 16 as const; // number of 16-bit memory spaces in the stack
export const PC_START = 512 as const; // program counter starts at 512
export const NUM_REGS = 16 as const; // number of available data registers
export const SPRITE_WIDTH = 8 as const; // width of a sprite drawn in graphics
export const TIMER_HZ = 60 as const; // frequency of countdown timers
export const CYCLE_HZ = 630 as const; // frequency of running each instruction
export const INSTRUCTION_SIZE_BYTES = 2 as const; // number of bytes an instruction is

export const DISPLAY_WIDTH = 64 as const;
export const DISPLAY_HEIGHT = 32 as const;

export const FONT_SET = new Uint8Array([
    0xf0,
    0x90,
    0x90,
    0x90,
    0xf0, // sprite for character 0
    0x20,
    0x60,
    0x20,
    0x20,
    0x70, // sprite for character 1
    0xf0,
    0x10,
    0xf0,
    0x80,
    0xf0, // sprite for character 2
    0xf0,
    0x10,
    0xf0,
    0x10,
    0xf0, // sprite for character 3
    0x90,
    0x90,
    0xf0,
    0x10,
    0x10, // sprite for character 4
    0xf0,
    0x80,
    0xf0,
    0x10,
    0xf0, // sprite for character 5
    0xf0,
    0x80,
    0xf0,
    0x90,
    0xf0, // sprite for character 6
    0xf0,
    0x10,
    0x20,
    0x40,
    0x40, // sprite for character 7
    0xf0,
    0x90,
    0xf0,
    0x90,
    0xf0, // sprite for character 8
    0xf0,
    0x90,
    0xf0,
    0x10,
    0xf0, // sprite for character 9
    0xf0,
    0x90,
    0xf0,
    0x90,
    0x90, // sprite for character A
    0xe0,
    0x90,
    0xe0,
    0x90,
    0xe0, // sprite for character B
    0xf0,
    0x80,
    0x80,
    0x80,
    0xf0, // sprite for character C
    0xe0,
    0x90,
    0x90,
    0x90,
    0xe0, // sprite for character D
    0xf0,
    0x80,
    0xf0,
    0x80,
    0xf0, // sprite for character E
    0xf0,
    0x80,
    0xf0,
    0x80,
    0x80, // sprite for character F
]);

export const QWERTY_KEYS = [
    "1",
    "2",
    "3",
    "4",
    "q",
    "w",
    "e",
    "r",
    "a",
    "s",
    "d",
    "f",
    "z",
    "x",
    "c",
    "v",
] as const;

export const KEYBOARD_MAPPER = new KeyboardMapper(QWERTY_KEYS);
