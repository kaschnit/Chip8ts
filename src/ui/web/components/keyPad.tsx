import * as React from "react";
import { Chip8Key, KeyboardMapper, ORDERED_CHIP8_KEYS } from "../../keyboard";

import "./keyPad.scss";

type ButtonPressHandler = (key: Chip8Key) => void;

type Props = {
    keyboardMapper: KeyboardMapper;
    onButtonDown?: ButtonPressHandler;
    onButtonUp?: ButtonPressHandler;
};

function noOp(): void {
    // do nothing
}

export function KeyPad({
    keyboardMapper,
    onButtonDown = noOp,
    onButtonUp = noOp,
}: Props): JSX.Element {
    const keys = ORDERED_CHIP8_KEYS.map((nativeKey, i) => (
        <button
            className="key"
            key={`keypad-${i}`}
            onMouseDown={(): void => onButtonDown(nativeKey)}
            onMouseUp={(): void => onButtonUp(nativeKey)}
        >
            <div className="keyHex">{nativeKey.toString(16).toUpperCase()}</div>
            <div className="keyActual">({keyboardMapper.untranslate(nativeKey)})</div>
        </button>
    ));

    return (
        <div className="keyPad">
            <h2>Keyboard</h2>
            <div className="keyContainer">{keys}</div>
        </div>
    );
}
