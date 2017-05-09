import { IMidiFile } from './midi-file';

export interface IMidiJsonParserResponseEventData {

    err?: {

        message: string;

    };

    index: number;

    midiFile: null | IMidiFile;

}
