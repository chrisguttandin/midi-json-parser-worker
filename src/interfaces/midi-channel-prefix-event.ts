import { IMidiEvent } from './midi-event';

export interface IMidiChannelPrefixEvent extends IMidiEvent {

    channelPrefix: number;

}
