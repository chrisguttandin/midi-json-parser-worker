import { IMidiEvent } from './midi-event';

export interface IMidiMidiPortEvent extends IMidiEvent {

    midiPort: number;

}
