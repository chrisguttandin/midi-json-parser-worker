import { IMidiEvent } from './midi-event';

export interface IMidiSetTempoEvent extends IMidiEvent {

    setTempo: {

        microsecondsPerBeat: number;

    };

}
