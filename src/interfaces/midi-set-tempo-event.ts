import { IMidiMetaEvent } from './midi-meta-event';

export interface IMidiSetTempoEvent extends IMidiMetaEvent {

    setTempo: {

        microsecondsPerBeat: number;

    };

}
