export declare class BadInstructionError extends Error {
    constructor(instr: number);
}
export declare class RomSizeError extends Error {
    constructor(size: number);
}
export declare class InvalidStateError extends Error {
    constructor(msg: string);
}
