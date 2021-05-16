export declare class Memory {
    private _mem;
    constructor(size: number);
    size(): number;
    load8(address: number): number;
    load16(address: number): number;
    store8(address: number, value: number): void;
    write(address: number, values: Uint8Array): void;
}
