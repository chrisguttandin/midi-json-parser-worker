import {
    IMidiChannelPrefixEvent,
    IMidiEndOfTrackEvent,
    IMidiKeySignatureEvent,
    IMidiLyricEvent,
    IMidiMidiPortEvent,
    IMidiSetTempoEvent,
    IMidiSmpteOffsetEvent,
    IMidiTextEvent,
    IMidiTimeSignatureEvent,
    IMidiTrackNameEvent
} from '../interfaces';

export type TMidiMetaEvent = IMidiChannelPrefixEvent
    | IMidiEndOfTrackEvent
    | IMidiKeySignatureEvent
    | IMidiLyricEvent
    | IMidiMidiPortEvent
    | IMidiSetTempoEvent
    | IMidiSmpteOffsetEvent
    | IMidiTextEvent
    | IMidiTimeSignatureEvent
    | IMidiTrackNameEvent;
