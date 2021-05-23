export declare const ORDERED_CHIP8_KEYS: readonly [1, 2, 3, 12, 4, 5, 6, 13, 7, 8, 9, 14, 10, 0, 11, 15];
export declare type Chip8Key = typeof ORDERED_CHIP8_KEYS[number];
export declare class KeyboardMapper {
    private readonly _keys;
    private readonly _mapping;
    private readonly _reverseMapping;
    constructor(keys: ReadonlyArray<string>);
    translate(key: string): Chip8Key;
    untranslate(key: Chip8Key): string;
    get keys(): ReadonlyArray<string>;
}
