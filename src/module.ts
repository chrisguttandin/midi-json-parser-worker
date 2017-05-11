import { IBrokerEvent, IErrorResponse, IParseResponse } from './interfaces';
import { parseArrayBuffer } from './midi-file-parser';

export * from './interfaces';
export * from './types';

addEventListener('message', ({ data }: IBrokerEvent) => {
    try {
        if (data.method === 'parse') {
            const { id, params: { arrayBuffer } } = data;

            const midiFile = parseArrayBuffer(arrayBuffer);

            postMessage(<IParseResponse> {
                error: null,
                id,
                result: { midiFile }
            });
        } else {
           throw new Error(`The given method "${ (<any> data).method }" is not supported`);
        }
    } catch (err) {
        postMessage(<IErrorResponse> {
            error: {
                message: err.message
            },
            id: data.id,
            result: null
        });
    }
});
