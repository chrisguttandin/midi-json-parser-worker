import { IMidiFile } from './midi-file';

export interface IParseResponse {

    error: null;

    id: number;

    result: {

        midiFile: IMidiFile;

    };

}
