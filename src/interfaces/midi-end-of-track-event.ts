import { IMidiEvent } from './midi-event';

export interface IMidiEndOfTrackEvent extends IMidiEvent {

    endOfTrack: boolean;

}
