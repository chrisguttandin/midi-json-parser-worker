import { IMidiEvent } from './midi-event';

export interface IMidiCopyrightNoticeEvent extends IMidiEvent {

    copyrightNotice: string;

}
