import { IMidiEvent } from './midi-event';

export interface IMidiFile {

    division: number;

    format: number;

    tracks: IMidiEvent[][];

}
