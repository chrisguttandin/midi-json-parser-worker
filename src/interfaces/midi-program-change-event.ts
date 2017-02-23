import { IMidiEvent } from './midi-event';

export interface IMidiProgramChangeEvent extends IMidiEvent {

    programChange: {

        programNumber: number;

    };

}
