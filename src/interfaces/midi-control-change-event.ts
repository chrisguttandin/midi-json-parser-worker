import { IMidiEvent } from './midi-event';

export interface IMidiControlChangeEvent extends IMidiEvent {

    controlChange: {

        type: number;

        value: number;

    };

}
