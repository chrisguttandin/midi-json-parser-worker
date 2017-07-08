import { TMidiEvent } from '../types';

export interface IMidiFile {

    division: number;

    format: number;

    tracks: TMidiEvent[][];

}
