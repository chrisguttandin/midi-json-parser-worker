import {
    IMidiChannelPrefixEvent,
    IMidiControlChangeEvent,
    IMidiEndOfTrackEvent,
    IMidiKeySignatureEvent,
    IMidiMetaEvent,
    IMidiMidiPortEvent,
    IMidiNoteOffEvent,
    IMidiNoteOnEvent,
    IMidiPitchBendEvent,
    IMidiProgramChangeEvent,
    IMidiSetTempoEvent,
    IMidiSmpteOffsetEvent,
    IMidiSysexEvent,
    IMidiTimeSingatureEvent,
    IMidiTrackNameEvent
} from '../interfaces';

export type TMidiEvent = IMidiChannelPrefixEvent |
    IMidiControlChangeEvent |
    IMidiEndOfTrackEvent |
    IMidiKeySignatureEvent |
    IMidiMetaEvent |
    IMidiMidiPortEvent |
    IMidiNoteOffEvent |
    IMidiNoteOnEvent |
    IMidiPitchBendEvent |
    IMidiProgramChangeEvent |
    IMidiSetTempoEvent |
    IMidiSmpteOffsetEvent |
    IMidiSysexEvent |
    IMidiTimeSingatureEvent |
    IMidiTrackNameEvent;
