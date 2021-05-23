/// <reference types="react" />
import { Chip8Key, KeyboardMapper } from "../../keyboard";
import "./keyPad.scss";
declare type ButtonPressHandler = (key: Chip8Key) => void;
declare type Props = {
    keyboardMapper: KeyboardMapper;
    onButtonDown?: ButtonPressHandler;
    onButtonUp?: ButtonPressHandler;
};
export declare function KeyPad({ keyboardMapper, onButtonDown, onButtonUp, }: Props): JSX.Element;
export {};
