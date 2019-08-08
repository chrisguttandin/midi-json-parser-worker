import {
    IMidiChannelPressureEvent,
    IMidiControlChangeEvent,
    IMidiNoteOffEvent,
    IMidiNoteOnEvent,
    IMidiPitchBendEvent,
    IMidiProgramChangeEvent,
    IMidiSysexEvent
} from '../interfaces';

export type TMidiStatusEvent = IMidiChannelPressureEvent |
    IMidiControlChangeEvent |
    IMidiNoteOffEvent |
    IMidiNoteOnEvent |
    IMidiPitchBendEvent |
    IMidiProgramChangeEvent |
    IMidiSysexEvent;
