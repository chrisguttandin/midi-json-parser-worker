import { IMidiEvent } from './midi-event';

export interface IMidiNoteOnEvent extends IMidiEvent {

    noteOn: {

        noteNumber: number;

        velocity: number;

    };

}
