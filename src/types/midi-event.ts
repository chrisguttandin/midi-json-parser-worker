import {
    IMidiControlChangeEvent,
    IMidiNoteOffEvent,
    IMidiNoteOnEvent,
    IMidiPitchBendEvent,
    IMidiProgramChangeEvent,
    IMidiSysexEvent
} from '../interfaces';
import { TMidiMetaEvent } from './midi-meta-event';

export type TMidiEvent = IMidiControlChangeEvent |
    IMidiNoteOffEvent |
    IMidiNoteOnEvent |
    IMidiPitchBendEvent |
    IMidiProgramChangeEvent |
    IMidiSysexEvent |
    TMidiMetaEvent;
