import { IMidiEvent } from './midi-event';

export interface IMidiPitchBendEvent extends IMidiEvent {

    pitchBend: number;

}
