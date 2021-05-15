export class BadInstructionError extends Error {
    public constructor(instr: number) {
        super(`Unknown instruction ${instr.toString(16)} encountered`);
    }
}

export class RomSizeError extends Error {
    public constructor(size: number) {
        super(`The ROM of size ${size} exceeds the memory bounds.`);
    }
}
