import { IMidiEvent } from './midi-event';

export interface IMidiTrackNameEvent extends IMidiEvent {

    trackName: string;

}
