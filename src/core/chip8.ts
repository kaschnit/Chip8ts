import { Graphics } from "./graphics";
import { Memory } from "./memory";
import { ProgramCounter } from "./programCounter";
import { Stack } from "./stack";
import { DelayTimer, SoundTimer } from "./timer";
import { VRegisters } from "./vregs";

export class Chip8 {
    private stack: Stack;
    private memory: Memory;
    private pc: ProgramCounter;
    private graphics: Graphics;
    private delayTimer: DelayTimer;
    private soundTimer: SoundTimer;
    private vregs: VRegisters;
    private awaitKeyReg: number | undefined;
    private ireg: number;

    public constructor(
        memory: Memory,
        stack: Stack,
        pc: ProgramCounter,
        graphics: Graphics,
        delayTimer: DelayTimer,
        soundTimer: SoundTimer,
        vregs: VRegisters
    ) {
        this.memory = memory;
        this.stack = stack;
        this.pc = pc;
        this.graphics = graphics;
        this.delayTimer = delayTimer;
        this.soundTimer = soundTimer;
        this.vregs = vregs;
        this.awaitKeyReg = undefined;

        this.ireg = 0;
    }

    runCycle(): void {}

    /*
     *	OPCODES
     *
     *		NNN: address
     *		NN: 8-bit constant
     *		N: 4-bit constant
     *		X and Y: 4-bit register identifier
     *		PC : Program Counter
     *		I : 16bit register (For memory address) (Similar to void pointer)
     *		VN: One of the 16 available variables. N may be 0 to F (hexadecimal)
     */

    /*
     *	0NNN
     *	Calls RCA 1802 program at address NNN. Not necessary for most ROMs.
     */
    private call(address: number): void {}

    /*
     *	00E0
     *	Clears the screen.
     */
    private clearDisplay(): void {
        // this.graphics.clear();
    }

    /*
     *	00EE
     *	Returns from a subroutine
     */
    private returnInstruction(): void {
        // set pc to return address and decrement stack pointer
        this.pc.jump(this.stack.pop());
    }

    /*
     *	1NNN
     *	Jumps to address NNN.
     */
    private goto(targetAddr: number): void {
        // have to move back to offset increment
        this.pc.jump(targetAddr - this.pc.instructionSize);
    }

    /*
     *	2NNN
     *	Calls subroutine at NNN.
     */
    private functionCall(targetAddr: number): void {
        this.stack.push(this.pc.value);
        this.goto(targetAddr);
    }

    /*
     *	3XNN
     *	Skips the next instruction if VX equals NN.
     *	(Usually the next instruction is a jump to skip a code block).
     */
    private skipIfEqualsConst(vx: number, val: number): void {
        if (this.vregs[vx] === val) {
            this.pc.increment();
        }
    }

    /*
     *	4XNN
     *	Skips the next instruction if VX does not equal NN.
     *	(Usually the next instruction is a jump to skip a code block).
     */
    private skipIfNequalConst(vx: number, val: number): void {
        if (this.vregs[vx] !== val) {
            this.pc.increment();
        }
    }

    /*
     *	5XY0
     *	Skips the next instruction if VX equals VY.
     *	(Usually the next instruction is a jump to skip a code block).
     */
    private skipIfEqualsReg(vx: number, vy: number): void {
        if (this.vregs[vx] === this.vregs[vy]) {
            this.pc.increment();
        }
    }

    /*
     *	6XNN
     *	Sets VX to NN.
     */
    private assignConst(vx: number, val: number): void {
        this.vregs[vx] = val;
    }

    /*
     *	7XNN
     *	Adds NN to VX. (Carry flag is not changed).
     */
    private addConst(vx: number, val: number): void {
        this.vregs[vx] += val;
    }

    /*
     *	8XY0
     *	Sets VX to the value of VY.
     */
    private assignReg(vx: number, vy: number): void {
        this.vregs[vx] = this.vregs[vy];
    }

    /*
     *	8XY1
     *	Sets VX to VX or VY. (Bitwise OR operation).
     */
    private bitwiseOr(vx: number, vy: number): void {
        this.vregs[vx] |= this.vregs[vy];
    }

    /*
     *	8XY2
     *	Sets VX to VX and VY. (Bitwise AND operation).
     */
    private bitwiseAnd(vx: number, vy: number): void {
        this.vregs[vx] &= this.vregs[vy];
    }

    /*
     *	8XY3
     *	Sets VX to VX xor VY. (Bitwise XOR operation).
     */
    private bitwiseXor(vx: number, vy: number): void {
        this.vregs[vx] ^= this.vregs[vy];
    }

    /*
     *	8XY4
     *	Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't.
     */
    private addReg(vx: number, vy: number): void {
        // add into result of >8 bits
        const result: number = this.vregs[vx] + this.vregs[vy];

        // set Vf to 1 if carry-out happened (value of bit 9 is 1 if carry-out)
        this.vregs[0xf] = (result >> 8) & 0x1;

        // mask down to 8 bit
        this.vregs[vx] = result;
    }

    /*
     *	8XY5
     *	VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
     */
    private subReg(vx: number, vy: number): void {
        // set Vf to 0 if borrow; set to 1 if no borrow
        this.vregs[0xf] = this.vregs[vx] >= this.vregs[vy] ? 1 : 0;

        // subtract and keep to 8 bits
        this.vregs[vx] -= this.vregs[vy];
    }

    /*
     *	8XY6
     *	Stores the least significant bit of VX in VF and then shifts VX to the right by 1.
     */
    private shiftRight(vx: number): void {
        // store lsb in Vf
        this.vregs[0xf] = this.vregs[vx] & 0x1;
        this.vregs[vx] >>= 1;
    }

    /*
     *	8XY7
     *	Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
     */
    private subRegOpposite(vx: number, vy: number): void {
        // set Vf to 0 if borrow; set to 1 if no borrow
        this.vregs[0xf] = this.vregs[vy] >= this.vregs[vx] ? 1 : 0;

        // subtract and keep 8 bits
        this.vregs[vx] = this.vregs[vy] - this.vregs[vx];
    }

    /*
     *	8XYE
     *	Stores the most significant bit of VX in VF and then shifts VX to the left by 1.
     */
    private shiftLeft(vx: number): void {
        // store msb in Vf
        this.vregs[0xf] = (this.vregs[vx] >> 7) & 0x1;
        this.vregs[vx] <<= 1;
    }

    /*
     *	9XY0
     *	Skips the next instruction if VX doesn't equal VY.
     *	(Usually the next instruction is a jump to skip a code block).
     */
    private skipIfNequalReg(vx: number, vy: number): void {
        if (this.vregs[vx] !== this.vregs[vy]) {
            this.pc.increment();
        }
    }

    /*
     *	ANNN
     *	Sets I to the address NNN.
     */
    private setIreg(address: number): void {
        this.ireg = address & 0xffff;
    }

    /*
     *	BNNN
     *	Jumps to the address NNN plus V0.
     */
    private jump(targetAddr: number): void {
        this.goto(this.vregs[0x0] + targetAddr);
    }

    /*
     *	CXNN
     *	Sets VX to the result of a bitwise and operation on a random number (Typically: 0 to 255) and NN.
     */
    private setRand(vx: number, mask: number): void {
        this.vregs[vx] = Math.floor(Math.random() * 256) & mask;
    }

    /*
     *	DXYN
     *	Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N pixels.
     *	Each row of 8 pixels is read as bit-coded starting from memory location I; I value doesn’t
     *	change after the execution of this instruction. As described above, VF is set to 1 if any screen
     *	pixels are flipped from set to unset when the sprite is drawn, and to 0 if that doesn’t happen.
     */
    private drawSprite(vx: number, vy: number, height: number): void {
        const xStart: number = this.vregs[vx];
        const yStart: number = this.vregs[vy];

        // Vf set to 1 if any pixels are flipped from on to off
        this.vregs[0xf] = 0;

        for (let yOffset: number = 0; yOffset < height; ++yOffset) {
            // get y coord accounting for wrap around
            const y: number = (yStart + yOffset) % this.graphics.height;

            // get yth pixel
            const pixels: number = this.memory.load8(this.ireg + yOffset);
            for (let xOffset: number = 0; xOffset < this.graphics.width; ++xOffset) {
                // mask all bits to 0 except the xOffset'th most significant bit
                const pixel: number = pixels & (0x80 >> xOffset);

                // if the resulting number is not zero, it will cause a flip
                if (pixel !== 0) {
                    // get x coord accounting for wrap around
                    const x: number = (xStart + xOffset) % this.graphics.width;

                    // // if it flips from 1 to 0, set Vf to 1
                    // if (this.graphics.isOn(x, y)) {
                    //   this.vregs[0xf] = 1;
                    // }

                    // // flip bit
                    // this.graphics.flipAt(x, y);
                }
            }
        }
    }

    /*
     *	EX9E
     *	Skips the next instruction if the key stored in VX is pressed.
     *	(Usually the next instruction is a jump to skip a code block).
     */
    private skipIfKeypress(vx: number): void {
        // if (this.keys[this.vregs[vx]]) {
        //   this.pc.increment();
        // }
    }

    /*
     *	EXA1
     *	Skips the next instruction if the key stored in VX isn't pressed.
     *	(Usually the next instruction is a jump to skip a code block).
     */
    private skipIfNotKeypress(vx: number): void {
        // if (!this.keys[this.vregs[vx]]) {
        //   this.pc.increment();
        // }
    }

    /*
     *	FX07
     *	Sets VX to the value of the delay timer.
     */
    private getDelayTimer(vx: number): void {
        this.vregs[vx] = this.delayTimer.getValue();
    }

    /*
     *	FX0A
     *	A key press is awaited, and then stored in VX.
     *	(Blocking Operation. All instruction halted until next key event).
     */
    private awaitGetKeyPress(vx: number): void {
        // set the await key reg.
        // when a keypress is detected the key will be stored in vx
        // and this value will be cleared.
        // the emulator is stopped from running while this value is not cleared.
        this.awaitKeyReg = vx;
    }

    /*
     *	FX15
     *	Sets the delay timer to VX.
     */
    private setDelayTimer(vx: number): void {
        this.delayTimer.setValue(this.vregs[vx]);
    }

    /*
     *	FX18
     *	Sets the sound timer to VX.
     */
    private setSoundTimer(vx: number): void {
        this.soundTimer.setValue(this.vregs[vx]);
    }

    /*
     *	FX1E
     *	Adds VX to I. VF is set to 1 when there is a range overflow (I+VX>0xFFF),
     *	and to 0 when there isn't.
     */
    private addRegToI(vx: number): void {
        const result: number = this.ireg + this.vregs[vx];

        // set Vf to 1 if range overflow (ireg out of memory index bounds), 0 otherwise
        this.vregs[0xf] = result >= this.memory.size() ? 1 : 0;

        // keep it down to 16 bits
        this.ireg = result & 0xffff;
    }

    /*
     *	FX29
     *	Sets I to the location of the sprite for the character in VX.
     *	Characters 0-F (in hexadecimal) are represented by a 4x5 font.
     */
    private setIToSprite(vx: number): void {
        this.ireg = (this.vregs[vx] * 5) & 0xffff;
    }

    /*
     *	FX33
     *	Stores the binary-coded decimal representation of VX, with the most significant of three
     *	digits at the address in I, the middle digit at I plus 1, and the least significant digit
     *	at I plus 2. (In other words, take the decimal representation of VX, place the hundreds
     *	digit in memory at location in I, the tens digit at location I+1, and the ones digit at
     *	location I+2).
     */
    private setBCD(vx: number): void {
        // value of Vx is 3 digit because it's an 8-bit register
        const val = this.vregs[vx];

        // get digits of register vx for BCD and store
        this.memory.store8(this.ireg, Math.floor(val / 100));
        this.memory.store8(this.ireg + 1, Math.floor(val / 10) % 10);
        this.memory.store8(this.ireg + 2, val % 10);
    }

    /*
     *	FX55
     *	Stores V0 to VX (including VX) in memory starting at address I. The offset from I
     *	is increased by 1 for each value written, but I itself is left unmodified.
     */
    private regDump(vx: number): void {
        for (let i: number = 0; i <= vx; ++i) {
            this.memory.store8(this.ireg + i, this.vregs[i]);
        }
    }

    /*
     *	FX65
     *	Fills V0 to VX (including VX) with values from memory starting at address I. The offset from I
     *	is increased by 1 for each value written, but I itself is left unmodified.
     */
    private regLoad(vx: number): void {
        for (let i: number = 0; i <= vx; ++i) {
            this.vregs[i] = this.memory.load8(this.ireg + i);
        }
    }
}
