export class BadInstructionError extends Error {
    public constructor(instr: number) {
        super(`Unknown instruction ${instr.toString(16)} encountered`);
    }
}

export class RomSizeError extends Error {
    public constructor(size: number, maxSize: number) {
        super(`ROM of length ${size} exceeds memory size ${maxSize}.`);
    }
}
