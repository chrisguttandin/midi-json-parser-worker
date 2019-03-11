import {
    IMidiChannelPrefixEvent,
    IMidiCopyrightNoticeEvent,
    IMidiEndOfTrackEvent,
    IMidiInstrumentNameEvent,
    IMidiKeySignatureEvent,
    IMidiLyricEvent,
    IMidiMarkerEvent,
    IMidiMidiPortEvent,
    IMidiSequencerSpecificEvent,
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
    | IMidiMarkerEvent
    | IMidiMidiPortEvent
    | IMidiSequencerSpecificEvent
    | IMidiSetTempoEvent
    | IMidiSmpteOffsetEvent
    | IMidiTextEvent
    | IMidiTimeSignatureEvent
    | IMidiTrackNameEvent;
