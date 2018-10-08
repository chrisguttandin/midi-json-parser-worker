import { TWorkerImplementation, createWorker } from 'worker-factory';
import { IMidiJsonParserWorkerCustomDefinition } from './interfaces';
import { parseArrayBuffer } from './midi-file-parser';

export * from './interfaces';
export * from './types';

createWorker<IMidiJsonParserWorkerCustomDefinition>(self, <TWorkerImplementation<IMidiJsonParserWorkerCustomDefinition>> {
    parse: ({ arrayBuffer }) => {
        const midiFile = parseArrayBuffer(arrayBuffer);

        return { result: midiFile };
    }
});
