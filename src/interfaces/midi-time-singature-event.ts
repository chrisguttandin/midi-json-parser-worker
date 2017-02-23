import { IMidiEvent } from './midi-event';

export interface IMidiTimeSingatureEvent extends IMidiEvent {

    timeSignature: {

        denominator: number;

        metronome: number;

        numerator: number;

        thirtyseconds: number;

    };

}
