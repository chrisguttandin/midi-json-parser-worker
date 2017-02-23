import { IMidiEvent } from './midi-event';

export interface IMidiKeySignatureEvent extends IMidiEvent {

    keySignature: {

        key: number;

        scale: number;

    };

}
