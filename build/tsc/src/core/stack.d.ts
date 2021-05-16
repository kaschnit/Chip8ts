export declare class Stack {
    private _mem;
    private _sp;
    constructor(size: number);
    push(val: number): void;
    pop(): number;
    size(): number;
}
