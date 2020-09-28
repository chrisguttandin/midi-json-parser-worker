import { IMidiStatusEvent } from './midi-status-event';

export interface IMidiChannelPressureEvent extends IMidiStatusEvent {
    channelPressure: {
        pressure: number;
    };
}
