import { IMidiJsonParserRequestEvent, IMidiJsonParserResponseEventData } from './interfaces';
import { parseArrayBuffer } from './midi-file-parser';

export { IMidiJsonParserRequestEvent, IMidiJsonParserResponseEventData };

const arrayBuffers: Map<number, ArrayBuffer> = new Map();

addEventListener('message', ({ data: { arrayBuffer, byteIndex, byteLength, index } }: IMidiJsonParserRequestEvent) => {
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
            postMessage(<IMidiJsonParserResponseEventData> {
                index,
                midiFile: parseArrayBuffer(completeArrayBuffer)
            });
        } catch (err) {
            postMessage(<IMidiJsonParserResponseEventData> {
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
