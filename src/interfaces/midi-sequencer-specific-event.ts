import { IMidiEvent } from './midi-event';

export interface IMidiSequencerSpecificEvent extends IMidiEvent {

    sequencerSpecificData: string;

}
