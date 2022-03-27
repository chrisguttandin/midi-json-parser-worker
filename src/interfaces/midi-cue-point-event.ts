import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiCuePointEvent extends IMidiMetaEvent {
    cuePoint: string;
}
