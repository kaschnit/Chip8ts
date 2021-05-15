import { BadInstructionError, RomSizeError } from "../exception/exceptions";
import { Graphics } from "./graphics";
import { Memory } from "./memory";
import { ProgramCounter } from "./programCounter";
import { Stack } from "./stack";
import { Timer } from "./timer";
import { Registers } from "./registers";
import { readFileAsBytes } from "../util/utils";
import { FONT_SET, SPRITE_WIDTH } from "../util/constants";
import { Chip8Key } from "./keyboard";

export type Chip8Params = {
    memory: Memory;
    stack: Stack;
    pc: ProgramCounter;
    graphics: Graphics;
    delayTimer: Timer;
    soundTimer: Timer;
    vregs: Registers;
    keyregs: Registers;
};
export class Chip8 {
    private _stack: Stack;
    private _memory: Memory;
    private _pc: ProgramCounter;
    private _graphics: Graphics;
    private _delayTimer: Timer;
    private _soundTimer: Timer;
    private _vreg: Registers;
    private _keyregs: Registers;
    private _awaitKeyReg: number | undefined;
    private _ireg: number;

    public constructor({
        memory,
        stack,
        pc,
        graphics,
        delayTimer,
        soundTimer,
        vregs,
        keyregs,
    }: Chip8Params) {
        this._memory = memory;

        // write the fonts to the start of the memory
        this._memory.write(0, FONT_SET);

        this._stack = stack;
        this._pc = pc;
        this._graphics = graphics;
        this._delayTimer = delayTimer;
        this._soundTimer = soundTimer;
        this._vreg = vregs;
        this._keyregs = keyregs;
        this._awaitKeyReg = undefined;
        this._ireg = 0;
    }

    public get graphics(): Graphics {
        return this._graphics;
    }

    public runCycle(): void {
        if (this._awaitKeyReg !== undefined) {
            return;
        }

        // graphics have not yet changed this cycle
        this._graphics.setClean();

        // instruction is 16bit
        const instr = this._memory.load16(this._pc.value);

        // get commonly used hex digits from instruction
        const hex4 = (instr & 0xf000) >> 12;
        const hex3 = (instr & 0x0f00) >> 8;
        const hex2 = (instr & 0x00f0) >> 4;

        // execute instruction based on opcode
        switch (hex4) {
            case 0x0:
                switch (instr & 0x0ff) {
                    case 0xe0:
                        this.clearDisplay();
                        break;
                    case 0xee:
                        this.returnInstruction();
                        break;
                    default:
                        this.call(instr & 0xfff);
                        break;
                }
                break;
            case 0x1:
                this.goto(instr & 0xfff);
                break;
            case 0x2:
                this.functionCall(instr & 0xfff);
                break;
            case 0x3:
                this.skipIfEqualsConst(hex3, instr & 0xff);
                break;
            case 0x4:
                this.skipIfNequalConst(hex3, instr & 0xff);
                break;
            case 0x5:
                this.skipIfEqualsReg(hex3, hex2);
                break;
            case 0x6:
                this.assignConst(hex3, instr & 0xff);
                break;
            case 0x7:
                this.addConst(hex3, instr & 0xff);
                break;
            case 0x8:
                switch (instr & 0xf) {
                    case 0x0:
                        this.assignReg(hex3, hex2);
                        break;
                    case 0x1:
                        this.bitwiseOr(hex3, hex2);
                        break;
                    case 0x2:
                        this.bitwiseAnd(hex3, hex2);
                        break;
                    case 0x3:
                        this.bitwiseXor(hex3, hex2);
                        break;
                    case 0x4:
                        this.addReg(hex3, hex2);
                        break;
                    case 0x5:
                        this.subReg(hex3, hex2);
                        break;
                    case 0x6:
                        this.shiftRight(hex3);
                        break;
                    case 0x7:
                        this.subRegOpposite(hex3, hex2);
                        break;
                    case 0xe:
                        this.shiftLeft(hex3);
                        break;
                    default:
                        throw new BadInstructionError(instr);
                }
                break;
            case 0x9:
                this.skipIfNequalReg(hex3, hex2);
                break;
            case 0xa:
                this.setIreg(instr & 0xfff);
                break;
            case 0xb:
                this.jump(instr & 0xfff);
                break;
            case 0xc:
                this.setRand(hex3, instr & 0xff);
                break;
            case 0xd:
                this.drawSprite(hex3, hex2, instr & 0xf);
                break;
            case 0xe:
                switch (instr & 0xff) {
                    case 0x9e:
                        this.skipIfKeypress(hex3);
                        break;
                    case 0xa1:
                        this.skipIfNotKeypress(hex3);
                        break;
                    default:
                        throw new BadInstructionError(instr);
                }
                break;
            case 0xf:
                switch (instr & 0x0ff) {
                    case 0x07:
                        this.getDelayTimer(hex3);
                        break;
                    case 0x0a:
                        this.awaitGetKeyPress(hex3);
                        break;
                    case 0x15:
                        this.setDelayTimer(hex3);
                        break;
                    case 0x18:
                        this.setSoundTimer(hex3);
                        break;
                    case 0x1e:
                        this.addRegToI(hex3);
                        break;
                    case 0x29:
                        this.setIToSprite(hex3);
                        break;
                    case 0x33:
                        this.setBCD(hex3);
                        break;
                    case 0x55:
                        this.regDump(hex3);
                        break;
                    case 0x65:
                        this.regLoad(hex3);
                        break;
                    default:
                        throw new BadInstructionError(instr);
                }
                break;
            default:
                throw new BadInstructionError(instr);
        }

        this._pc.increment();
    }

    public async loadRom(romFile: File): Promise<void> {
        const romBytes: Uint8Array = await readFileAsBytes(romFile);
        if (this._pc.initial + romBytes.length >= this._memory.size()) {
            throw new RomSizeError(romBytes.length);
        }
        // write the rom into memory
        this._memory.write(this._pc.initial, romBytes);
    }

    public setKeyPress(key: Chip8Key, pressed: boolean): void {
        this._keyregs.set(key, pressed ? 1 : 0);
        if (this._awaitKeyReg !== undefined && pressed) {
            this._vreg.set(this._awaitKeyReg, key);
            this._awaitKeyReg = undefined;
        }
    }

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
    private call(address: number): void {
        // TODO
        console.log("Calling", address);
    }

    /*
     *	00E0
     *	Clears the screen.
     */
    private clearDisplay(): void {
        this._graphics.clear();
    }

    /*
     *	00EE
     *	Returns from a subroutine
     */
    private returnInstruction(): void {
        // set pc to return address and decrement stack pointer
        this._pc.jump(this._stack.pop());
    }

    /*
     *	1NNN
     *	Jumps to address NNN.
     */
    private goto(targetAddr: number): void {
        // have to move back to offset increment
        this._pc.jump(targetAddr - this._pc.instructionSize);
    }

    /*
     *	2NNN
     *	Calls subroutine at NNN.
     */
    private functionCall(targetAddr: number): void {
        this._stack.push(this._pc.value);
        this.goto(targetAddr);
    }

    /*
     *	3XNN
     *	Skips the next instruction if VX equals NN.
     *	(Usually the next instruction is a jump to skip a code block).
     */
    private skipIfEqualsConst(vx: number, val: number): void {
        if (this._vreg.get(vx) === val) {
            this._pc.increment();
        }
    }

    /*
     *	4XNN
     *	Skips the next instruction if VX does not equal NN.
     *	(Usually the next instruction is a jump to skip a code block).
     */
    private skipIfNequalConst(vx: number, val: number): void {
        if (this._vreg.get(vx) !== val) {
            this._pc.increment();
        }
    }

    /*
     *	5XY0
     *	Skips the next instruction if VX equals VY.
     *	(Usually the next instruction is a jump to skip a code block).
     */
    private skipIfEqualsReg(vx: number, vy: number): void {
        if (this._vreg.get(vx) === this._vreg.get(vy)) {
            this._pc.increment();
        }
    }

    /*
     *	6XNN
     *	Sets VX to NN.
     */
    private assignConst(vx: number, val: number): void {
        this._vreg.set(vx, val);
    }

    /*
     *	7XNN
     *	Adds NN to VX. (Carry flag is not changed).
     */
    private addConst(vx: number, val: number): void {
        this._vreg.set(vx, this._vreg.get(vx) + val);
    }

    /*
     *	8XY0
     *	Sets VX to the value of VY.
     */
    private assignReg(vx: number, vy: number): void {
        this._vreg.set(vx, this._vreg.get(vy));
    }

    /*
     *	8XY1
     *	Sets VX to VX or VY. (Bitwise OR operation).
     */
    private bitwiseOr(vx: number, vy: number): void {
        this._vreg.set(vx, this._vreg.get(vx) | this._vreg.get(vy));
    }

    /*
     *	8XY2
     *	Sets VX to VX and VY. (Bitwise AND operation).
     */
    private bitwiseAnd(vx: number, vy: number): void {
        this._vreg.set(vx, this._vreg.get(vx) & this._vreg.get(vy));
    }

    /*
     *	8XY3
     *	Sets VX to VX xor VY. (Bitwise XOR operation).
     */
    private bitwiseXor(vx: number, vy: number): void {
        this._vreg.set(vx, this._vreg.get(vx) ^ this._vreg.get(vy));
    }

    /*
     *	8XY4
     *	Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't.
     */
    private addReg(vx: number, vy: number): void {
        // add into result of >8 bits
        const result = this._vreg.get(vx) + this._vreg.get(vy);

        // set Vf to 1 if carry-out happened (value of bit 9 is 1 if carry-out)
        this._vreg.set(0xf, (result >> 8) & 0x1);

        this._vreg.set(vx, result);
    }

    /*
     *	8XY5
     *	VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
     */
    private subReg(vx: number, vy: number): void {
        // set Vf to 0 if borrow; set to 1 if no borrow
        this._vreg.set(0xf, this._vreg.get(vx) >= this._vreg.get(vy) ? 1 : 0);

        // subtract and keep to 8 bits
        this._vreg.set(vx, this._vreg.get(vx) - this._vreg.get(vy));
    }

    /*
     *	8XY6
     *	Stores the least significant bit of VX in VF and then shifts VX to the right by 1.
     */
    private shiftRight(vx: number): void {
        // store lsb in Vf
        this._vreg.set(0xf, this._vreg.get(vx) & 0x1);
        this._vreg.set(vx, this._vreg.get(vx) >> 1);
    }

    /*
     *	8XY7
     *	Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
     */
    private subRegOpposite(vx: number, vy: number): void {
        // set Vf to 0 if borrow; set to 1 if no borrow
        this._vreg.set(0xf, this._vreg.get(vy) >= this._vreg.get(vx) ? 1 : 0);

        // subtract and keep 8 bits
        this._vreg.set(vx, this._vreg.get(vy) - this._vreg.get(vx));
    }

    /*
     *	8XYE
     *	Stores the most significant bit of VX in VF and then shifts VX to the left by 1.
     */
    private shiftLeft(vx: number): void {
        // store msb in Vf
        this._vreg.set(0xf, (this._vreg.get(vx) >> 7) & 0x1);
        this._vreg.set(vx, this._vreg.get(vx) << 1);
    }

    /*
     *	9XY0
     *	Skips the next instruction if VX doesn't equal VY.
     *	(Usually the next instruction is a jump to skip a code block).
     */
    private skipIfNequalReg(vx: number, vy: number): void {
        if (this._vreg.get(vx) !== this._vreg.get(vy)) {
            this._pc.increment();
        }
    }

    /*
     *	ANNN
     *	Sets I to the address NNN.
     */
    private setIreg(address: number): void {
        this._ireg = address & 0xffff;
    }

    /*
     *	BNNN
     *	Jumps to the address NNN plus V0.
     */
    private jump(address: number): void {
        this.goto(this._vreg.get(0x0) + address);
    }

    /*
     *	CXNN
     *	Sets VX to the result of a bitwise and operation on a random number (Typically: 0 to 255) and NN.
     */
    private setRand(vx: number, mask: number): void {
        this._vreg.set(vx, Math.floor(Math.random() * 256) & mask);
    }

    /*
     *	DXYN
     *	Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N pixels.
     *	Each row of 8 pixels is read as bit-coded starting from memory location I; I value doesn’t
     *	change after the execution of this instruction. As described above, VF is set to 1 if any screen
     *	pixels are flipped from set to unset when the sprite is drawn, and to 0 if that doesn’t happen.
     */
    private drawSprite(vx: number, vy: number, height: number): void {
        const xStart = this._vreg.get(vx);
        const yStart = this._vreg.get(vy);

        // Vf set to 1 if any pixels are flipped from on to off
        this._vreg.set(0xf, 0);

        for (let yOffset = 0; yOffset < height; ++yOffset) {
            // get y coord accounting for wrap around
            const y = (yStart + yOffset) % this._graphics.height;

            // get yth pixel
            const pixels = this._memory.load8(this._ireg + yOffset);
            for (let xOffset = 0; xOffset < SPRITE_WIDTH; ++xOffset) {
                // mask all bits to 0 except the xOffset'th most significant bit
                const pixel = pixels & (0x80 >> xOffset);

                // if the resulting number is not zero, it will cause a flip
                if (pixel !== 0) {
                    // get x coord accounting for wrap around
                    const x = (xStart + xOffset) % this._graphics.width;

                    // if it flips from 1 to 0, set Vf to 1
                    if (this._graphics.get(x, y) !== 0) {
                        this._vreg.set(0xf, 1);
                    }

                    // flip bit
                    this._graphics.flip(x, y);
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
        if (this._keyregs.get(this._vreg.get(vx)) !== 0) {
            this._pc.increment();
        }
    }

    /*
     *	EXA1
     *	Skips the next instruction if the key stored in VX isn't pressed.
     *	(Usually the next instruction is a jump to skip a code block).
     */
    private skipIfNotKeypress(vx: number): void {
        if (this._keyregs.get(this._vreg.get(vx)) === 0) {
            this._pc.increment();
        }
    }

    /*
     *	FX07
     *	Sets VX to the value of the delay timer.
     */
    private getDelayTimer(vx: number): void {
        this._vreg.set(vx, this._delayTimer.getValue());
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
        this._awaitKeyReg = vx;
    }

    /*
     *	FX15
     *	Sets the delay timer to VX.
     */
    private setDelayTimer(vx: number): void {
        this._delayTimer.setValue(this._vreg.get(vx));
    }

    /*
     *	FX18
     *	Sets the sound timer to VX.
     */
    private setSoundTimer(vx: number): void {
        this._soundTimer.setValue(this._vreg.get(vx));
    }

    /*
     *	FX1E
     *	Adds VX to I. VF is set to 1 when there is a range overflow (I+VX>0xFFF),
     *	and to 0 when there isn't.
     */
    private addRegToI(vx: number): void {
        const result = this._ireg + this._vreg.get(vx);

        // set Vf to 1 if range overflow (ireg out of memory index bounds), 0 otherwise
        this._vreg.set(0xf, result >= this._memory.size() ? 1 : 0);

        // keep it down to 16 bits
        this._ireg = result & 0xffff;
    }

    /*
     *	FX29
     *	Sets I to the location of the sprite for the character in VX.
     *	Characters 0-F (in hexadecimal) are represented by a 4x5 font.
     */
    private setIToSprite(vx: number): void {
        this._ireg = (this._vreg.get(vx) * 5) & 0xffff;
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
        const val = this._vreg.get(vx);

        // get digits of register vx for BCD and store
        this._memory.store8(this._ireg, Math.floor(val / 100));
        this._memory.store8(this._ireg + 1, Math.floor(val / 10) % 10);
        this._memory.store8(this._ireg + 2, val % 10);
    }

    /*
     *	FX55
     *	Stores V0 to VX (including VX) in memory starting at address I. The offset from I
     *	is increased by 1 for each value written, but I itself is left unmodified.
     */
    private regDump(vx: number): void {
        for (let i = 0; i <= vx; ++i) {
            this._memory.store8(this._ireg + i, this._vreg.get(i));
        }
    }

    /*
     *	FX65
     *	Fills V0 to VX (including VX) with values from memory starting at address I. The offset from I
     *	is increased by 1 for each value written, but I itself is left unmodified.
     */
    private regLoad(vx: number): void {
        for (let i = 0; i <= vx; ++i) {
            this._vreg.set(i, this._memory.load8(this._ireg + i));
        }
    }
}
