/**
 * Read binary file and return promise with binary data.
 * @param file the binary file to read
 */
export declare function readFileAsBytes(file: File): Promise<Uint8Array>;
/**
 * Remove all children from an HTML element.
 * @param element the element to remove all children from
 */
export declare function removeChildren(element: HTMLElement): void;
export declare function range(start: number, stop?: number, step?: number): Generator<number, void, unknown>;
