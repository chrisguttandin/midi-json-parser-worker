import { IMidiEvent } from './midi-event';

export interface IMidiFile {

    division: number;

    err?: {

        message: string;

    };

    format: number;

    tracks: IMidiEvent[][];

}
