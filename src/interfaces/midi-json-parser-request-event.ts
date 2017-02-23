import { IMidiJsonParserRequestEventData } from './midi-json-parser-request-event-data';

export interface IMidiJsonParserRequestEvent extends Event {

    data: IMidiJsonParserRequestEventData;

}
