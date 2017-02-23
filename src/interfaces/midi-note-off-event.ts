import { IMidiEvent } from './midi-event';

export interface IMidiNoteOffEvent extends IMidiEvent {

    noteOff: {

        noteNumber: number;

        velocity: number;

    };

}
