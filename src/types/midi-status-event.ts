import {
    IMidiControlChangeEvent,
    IMidiNoteOffEvent,
    IMidiNoteOnEvent,
    IMidiPitchBendEvent,
    IMidiProgramChangeEvent,
    IMidiSysexEvent
} from '../interfaces';

export type TMidiStatusEvent = IMidiControlChangeEvent |
    IMidiNoteOffEvent |
    IMidiNoteOnEvent |
    IMidiPitchBendEvent |
    IMidiProgramChangeEvent |
    IMidiSysexEvent;
