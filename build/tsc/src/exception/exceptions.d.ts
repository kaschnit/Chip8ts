export declare class InvalidStateError extends Error {
    constructor(msg: string);
}
export declare class InputError extends Error {
    constructor(msg: string);
}
export declare class BadInstructionError extends InputError {
    constructor(instr: number);
}
export declare class RomSizeError extends InputError {
    constructor(size: number);
}
