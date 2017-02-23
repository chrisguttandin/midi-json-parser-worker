import { IMidiEvent } from './midi-event';

export interface IMidiSmpteOffsetEvent extends IMidiEvent {

    smpteOffset: {

        frame: number;

        frameRate: number;

        hour: number;

        minutes: number;

        seconds: number;

        subFrame: number;

    };

}
