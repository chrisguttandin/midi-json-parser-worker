import { IMidiChannelPrefixEvent } from './midi-channel-prefix-event';
import { IMidiEndOfTrackEvent } from './midi-end-of-track-event';
import { IMidiKeySignatureEvent } from './midi-key-signature-event';
import { IMidiMidiPortEvent } from './midi-midi-port-event';
import { IMidiSetTempoEvent } from './midi-set-tempo-event';
import { IMidiSmpteOffsetEvent } from './midi-smpte-offset-event';
import { IMidiTextEvent } from './midi-text-event';
import { IMidiTimeSignatureEvent } from './midi-time-signature-event';
import { IMidiTrackNameEvent } from './midi-track-name-event';

export type IMidiMetaEvent = IMidiChannelPrefixEvent
    | IMidiEndOfTrackEvent
    | IMidiKeySignatureEvent
    | IMidiMidiPortEvent
    | IMidiSetTempoEvent
    | IMidiSmpteOffsetEvent
    | IMidiTextEvent
    | IMidiTimeSignatureEvent
    | IMidiTrackNameEvent;
