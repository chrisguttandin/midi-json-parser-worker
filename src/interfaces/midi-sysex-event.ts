import { IMidiEvent } from './midi-event';

export interface IMidiSysexEvent extends IMidiEvent {

    sysex: string;

}
