import { IValueMap } from 'worker-factory';

export interface IMidiEvent extends IValueMap {

    channel: number;

    delta: number;

}
