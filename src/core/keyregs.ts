export class KeyRegs {

	private _keys: Array<boolean>;

	public constructor(size: number) {
		this._keys = Array<boolean>(size).fill(false);
	}

	public get(key: number): boolean {
		return this._keys[key];
	}

	public set(key: number, value: boolean): void {
		this._keys[key] = value;
	}
}