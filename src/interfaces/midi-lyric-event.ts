import { IMidiEvent } from './midi-event';

export interface IMidiLyricEvent extends IMidiEvent {

    lyric: string;

}
