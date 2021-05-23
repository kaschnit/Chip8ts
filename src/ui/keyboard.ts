import { InputError } from "../exception/exceptions";

export const ORDERED_CHIP8_KEYS = [
    0x1,
    0x2,
    0x3,
    0xc,
    0x4,
    0x5,
    0x6,
    0xd,
    0x7,
    0x8,
    0x9,
    0xe,
    0xa,
    0x0,
    0xb,
    0xf,
] as const;

export type Chip8Key = typeof ORDERED_CHIP8_KEYS[number];

type InternalKeyMapping = Record<string, Chip8Key>;
type InternalKeyReverseMapping = Record<Chip8Key, string>;

export class KeyboardMapper {
    private readonly _keys: ReadonlyArray<string>;

    private readonly _mapping: InternalKeyMapping;
    private readonly _reverseMapping: InternalKeyReverseMapping;

    public constructor(keys: ReadonlyArray<string>) {
        if (keys.length !== ORDERED_CHIP8_KEYS.length) {
            throw new InputError(
                `Key list of size ${keys.length} exceeds is not the expected size ${ORDERED_CHIP8_KEYS.length}: ${keys}`
            );
        }

        this._keys = keys;

        this._mapping = {};
        this._reverseMapping = {} as InternalKeyReverseMapping;
        for (let i = 0; i < ORDERED_CHIP8_KEYS.length; ++i) {
            this._mapping[keys[i]] = ORDERED_CHIP8_KEYS[i];
            this._reverseMapping[ORDERED_CHIP8_KEYS[i]] = keys[i];
        }
    }

    public translate(key: string): Chip8Key {
        if (key in this._mapping) {
            return this._mapping[key];
        }
        throw new InputError(
            `Provided key ${key} is not in the allowed list of keys: ${this._keys}`
        );
    }

    public untranslate(key: Chip8Key): string {
        if (key in this._reverseMapping) {
            return this._reverseMapping[key];
        }
        throw new InputError(
            `Provided key ${key} is not in the allowed list of values: ${ORDERED_CHIP8_KEYS}`
        );
    }

    public get keys(): ReadonlyArray<string> {
        return this._keys;
    }
}
