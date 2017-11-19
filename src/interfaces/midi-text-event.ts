import { IMidiEvent } from './midi-event';

export interface IMidiTextEvent extends IMidiEvent {

    text: string;

}
