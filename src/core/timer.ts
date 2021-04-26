export class DelayTimer {
    protected _msDelay: number;
    protected _value: number;
    protected _interval: ReturnType<typeof setInterval> | undefined;

    public constructor(hz: number) {
        this._msDelay = 1000 / hz;
        this._value = 0;
        this._interval = undefined;
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
                this.timerHasReachedZero();
            }
        }, this._msDelay);
    }

    protected timerHasReachedZero(): void {
        // Do nothing
    }
}

export class SoundTimer extends DelayTimer {
    protected timerHasReachedZero(): void {
        // @TODO: implement playing sound when delay reaches zero
        console.log("Playing beeping sound!");
    }
}
