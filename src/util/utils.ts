/**
 * Read binary file and return promise with binary data.
 *
 * @param file: File - binary file to read
 */
export async function readBinaryFileAsBytes(file: File): Promise<Uint8Array> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = (): void => resolve(new Uint8Array(reader?.result as ArrayBuffer));
        reader.onerror = (): void => reject("ERROR READING ROM");
        reader.readAsArrayBuffer(file);
    });
}
