export class Timer {
    private _msDelay: number;
    private _value: number;
    private _interval: ReturnType<typeof setInterval> | undefined;
    private _hasReachedZero: (() => void) | undefined;

    public constructor(hz: number, hasReachedZero?: () => void) {
        this._msDelay = 1000 / hz;
        this._value = 0;
        this._interval = undefined;
        this._hasReachedZero = hasReachedZero;
    }

    public getValue(): number {
        return this._value;
    }

    public setValue(value: number): void {
        this._value = value;
        if (this._interval !== undefined) {
            clearInterval(this._interval);
        }
        this.startCountdown();
    }

    private startCountdown(): void {
        this._interval = setInterval(() => {
            if (--this._value === 0) {
                if (this._interval !== undefined) {
                    clearInterval(this._interval);
                }
                if (this._hasReachedZero) {
                    this._hasReachedZero();
                }
            }
        }, this._msDelay);
    }
}
