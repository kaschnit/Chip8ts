export class DelayTimer {
    protected msDelay: number;
    protected value: number;
    protected interval: ReturnType<typeof setInterval>;

    constructor(hz: number) {
        this.msDelay = 1000 / hz;
        this.value = 0;
        this.interval = undefined;
    }

    public getValue(): number {
        return this.value;
    }

    public setValue(value: number): void {
        this.value = value;
        clearInterval(this.interval);
        this.startCountdown();
    }

    private startCountdown(): void {
        this.interval = setInterval(() => {
            if (--this.value === 0) {
                clearInterval(this.interval);
                this.timerHasReachedZero();
            }
        }, this.msDelay);
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
