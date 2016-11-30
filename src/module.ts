import { parseArrayBuffer } from './midi-file-parser';

const arrayBuffers = new Map();

self.addEventListener('message', ({ data: { arrayBuffer, byteIndex, byteLength, index } }) => {
    let completeArrayBuffer = arrayBuffers.get(index);

    if (completeArrayBuffer === undefined) {
        completeArrayBuffer = new ArrayBuffer(byteLength);
        arrayBuffers.set(index, completeArrayBuffer);
    }

    const destination = new Uint8Array(completeArrayBuffer);

    const length = Math.min(byteIndex + 1048576, byteLength);

    const source = new Uint8Array(arrayBuffer);

    for (let i = byteIndex; i < length; i += 1) {
        destination[i] = source[i - byteIndex];
    }

    if (length === byteLength) {
        try {
            self.postMessage({
                index,
                midiFile: parseArrayBuffer(completeArrayBuffer)
            });
        } catch (err) {
            self.postMessage({
                err: {
                    message: err.message
                },
                index,
                midiFile: null
            });
        }

        arrayBuffers.delete(index);
    }
});
