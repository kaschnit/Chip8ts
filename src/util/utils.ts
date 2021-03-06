/**
 * Read binary file and return promise with binary data.
 * @param file the binary file to read
 */
export async function readFileAsBytes(file: File): Promise<Uint8Array> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = (): void => resolve(new Uint8Array(reader?.result as ArrayBuffer));
        reader.onerror = (): void => reject("ERROR READING FILE");
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Remove all children from an HTML element.
 * @param element the element to remove all children from
 */
export function removeChildren(element: HTMLElement): void {
    // Remove all children of container so the canvas is the only thing present.
    // Stops multiple canvases from being rendered by one instance, leaving unreferenced canvases.
    // Faster than setting innerhtml='' https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript)
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

export function* range(start: number, stop?: number, step = 1): Generator<number, void, unknown> {
    if (stop === undefined) {
        [start, stop] = [0, start];
    }
    
    if (step > 0) {
        while (start < stop) {
            yield start, start += step;
        }
    }
    else if (step < 0) {
        while (start > stop) {
            yield start, start += step;
        }
    }
 } 