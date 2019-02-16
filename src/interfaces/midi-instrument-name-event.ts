import { IMidiEvent } from './midi-event';

export interface IMidiInstrumentNameEvent extends IMidiEvent {

    instrumentName: string;

}
