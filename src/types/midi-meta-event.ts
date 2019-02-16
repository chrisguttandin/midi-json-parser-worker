import {
    IMidiChannelPrefixEvent,
    IMidiCopyrightNoticeEvent,
    IMidiEndOfTrackEvent,
    IMidiInstrumentNameEvent,
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
    | IMidiCopyrightNoticeEvent
    | IMidiEndOfTrackEvent
    | IMidiInstrumentNameEvent
    | IMidiKeySignatureEvent
    | IMidiLyricEvent
    | IMidiMidiPortEvent
    | IMidiSetTempoEvent
    | IMidiSmpteOffsetEvent
    | IMidiTextEvent
    | IMidiTimeSignatureEvent
    | IMidiTrackNameEvent;
