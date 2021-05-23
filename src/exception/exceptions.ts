export class InvalidStateError extends Error {
    public constructor(msg: string) {
        super(msg);
    }
}

export class InputError extends Error {
    public constructor(msg: string) {
        super(msg);
    }
}

export class BadInstructionError extends InputError {
    public constructor(instr: number) {
        super(`Unknown instruction ${instr.toString(16)} encountered`);
    }
}

export class RomSizeError extends InputError {
    public constructor(size: number) {
        super(`The ROM of size ${size} exceeds the memory bounds.`);
    }
}
