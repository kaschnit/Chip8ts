export declare class Timer {
    private _msDelay;
    private _value;
    private _interval;
    private _hasReachedZero;
    constructor(hz: number, hasReachedZero?: () => void);
    getValue(): number;
    setValue(value: number): void;
    private startCountdown;
}
