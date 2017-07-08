import { IMidiEvent } from './midi-event';

export interface IMidiTimeSignatureEvent extends IMidiEvent {

    timeSignature: {

        denominator: number;

        metronome: number;

        numerator: number;

        thirtyseconds: number;

    };

}
