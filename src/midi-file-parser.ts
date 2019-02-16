import { hexify } from './helpers/hexify';
import { stringify } from './helpers/stringify';
import {
    IMidiChannelPrefixEvent,
    IMidiControlChangeEvent,
    IMidiCopyrightNoticeEvent,
    IMidiEndOfTrackEvent,
    IMidiInstrumentNameEvent,
    IMidiKeySignatureEvent,
    IMidiLyricEvent,
    IMidiMidiPortEvent,
    IMidiNoteOffEvent,
    IMidiNoteOnEvent,
    IMidiPitchBendEvent,
    IMidiProgramChangeEvent,
    IMidiSequencerSpecificEvent,
    IMidiSetTempoEvent,
    IMidiSmpteOffsetEvent,
    IMidiSysexEvent,
    IMidiTextEvent,
    IMidiTimeSignatureEvent,
    IMidiTrackNameEvent
} from './interfaces';
import { TMidiEvent, TMidiMetaEvent } from './types';

export const parseArrayBuffer = (arrayBuffer: ArrayBuffer) => {
    const dataView = new DataView(arrayBuffer);

    const header = _parseHeaderChunk(dataView); // tslint:disable-line:no-use-before-declare

    let offset = 14;

    const tracks = [];

    for (let i = 0, length = header.numberOfTracks; i < length; i += 1) {
        let track;

        ({ offset, track } = _parseTrackChunk(dataView, offset)); // tslint:disable-line:no-use-before-declare

        tracks.push(track);
    }

    return {
        division: header.division,
        format: header.format,
        tracks
    };
};

const _parseEvent = (dataView: DataView, offset: number, lastEvent: null | TMidiEvent): { event: TMidiEvent; offset: number } => {
    let result: { event: TMidiEvent; offset: number };

    const { offset: nextOffset, value: delta } = _readVariableLengthQuantity( // tslint:disable-line:no-use-before-declare
        dataView,
        offset
    );

    const eventTypeByte = dataView.getUint8(nextOffset);

    if (eventTypeByte === 0xF0) { // tslint:disable-line:no-bitwise
        result = _parseSysexEvent(dataView, nextOffset + 1); // tslint:disable-line:no-use-before-declare
    } else if (eventTypeByte === 0xFF) { // tslint:disable-line:no-bitwise
        result = _parseMetaEvent(dataView, nextOffset + 1); // tslint:disable-line:no-use-before-declare
    } else {
        result = _parseMidiEvent(eventTypeByte, dataView, nextOffset + 1, lastEvent); // tslint:disable-line:no-use-before-declare
    }

    result.event.delta = delta;

    return result;
};

const _parseHeaderChunk = (dataView: DataView) => {
    if (stringify(dataView, 0, 4) !== 'MThd') {
        throw new Error(`Unexpected characters "${ stringify(dataView, 0, 4) }" found instead of "MThd"`);
    }

    if (dataView.getUint32(4) !== 6) {
        throw new Error(`The header has an unexpected length of ${ dataView.getUint32(4) } instead of 6`);
    }

    const format = dataView.getUint16(8);

    const numberOfTracks = dataView.getUint16(10);

    const division = dataView.getUint16(12);

    return {
        division,
        format,
        numberOfTracks
    };
};

const _parseMetaEvent = (dataView: DataView, offset: number): { event: TMidiMetaEvent; offset: number } => {
    let event: TMidiMetaEvent;

    const metaTypeByte = dataView.getUint8(offset);
    const { offset: nextOffset, value: length } = _readVariableLengthQuantity( // tslint:disable-line:no-use-before-declare
        dataView,
        offset + 1
    );

    if (metaTypeByte === 0x01) { // tslint:disable-line:no-bitwise
        event = <IMidiTextEvent> {
            text: stringify(dataView, nextOffset, length)
        };
    } else if (metaTypeByte === 0x02) { // tslint:disable-line:no-bitwise
        event = <IMidiCopyrightNoticeEvent> {
            copyrightNotice: stringify(dataView, nextOffset, length)
        };
    } else if (metaTypeByte === 0x03) { // tslint:disable-line:no-bitwise
        event = <IMidiTrackNameEvent> {
            trackName: stringify(dataView, nextOffset, length)
        };
    } else if (metaTypeByte === 0x04) { // tslint:disable-line:no-bitwise
        event = <IMidiInstrumentNameEvent> {
            instrumentName: stringify(dataView, nextOffset, length)
        };
    } else if (metaTypeByte === 0x05) { // tslint:disable-line:no-bitwise
        event = <IMidiLyricEvent> {
            lyric: stringify(dataView, nextOffset, length)
        };
    } else if (metaTypeByte === 0x20) { // tslint:disable-line:no-bitwise
        event = <IMidiChannelPrefixEvent> {
            channelPrefix: dataView.getUint8(nextOffset)
        };
    } else if (metaTypeByte === 0x21) { // tslint:disable-line:no-bitwise
        event = <IMidiMidiPortEvent> {
            midiPort: dataView.getUint8(nextOffset)
        };
    } else if (metaTypeByte === 0x2F) { // tslint:disable-line:no-bitwise

        // @todo length must be 0

        event = <IMidiEndOfTrackEvent> {
            endOfTrack: true
        };
    } else if (metaTypeByte === 0x51) { // tslint:disable-line:no-bitwise

        // @todo length must be 5

        event = <IMidiSetTempoEvent> {
            setTempo: {
                microsecondsPerBeat: (
                    (dataView.getUint8(nextOffset) << 16) + // tslint:disable-line:no-bitwise
                    (dataView.getUint8(nextOffset + 1) << 8) + // tslint:disable-line:no-bitwise
                    dataView.getUint8(nextOffset + 2)
                )
            }
        };
    } else if (metaTypeByte === 0x54) { // tslint:disable-line:no-bitwise
        let frameRate;

        // @todo length must be 5

        const hourByte = dataView.getUint8(nextOffset);

        if ((hourByte & 0x60) === 0x00) { // tslint:disable-line:no-bitwise
            frameRate = 24;
        } else if ((hourByte & 0x60) === 0x20) { // tslint:disable-line:no-bitwise
            frameRate = 25;
        } else if ((hourByte & 0x60) === 0x40) { // tslint:disable-line:no-bitwise
            frameRate = 29;
        } else if ((hourByte & 0x60) === 0x60) { // tslint:disable-line:no-bitwise
            frameRate = 30;
        }

        event = <IMidiSmpteOffsetEvent> {
            smpteOffset: {
                frame: dataView.getUint8(nextOffset + 3),
                frameRate,
                hour: hourByte & 0x1F,  // tslint:disable-line:no-bitwise
                minutes: dataView.getUint8(nextOffset + 1),
                seconds: dataView.getUint8(nextOffset + 2),
                subFrame: dataView.getUint8(nextOffset + 4)
            }
        };
    } else if (metaTypeByte === 0x58) { // tslint:disable-line:no-bitwise
        event = <IMidiTimeSignatureEvent> {
            timeSignature: {
                denominator: Math.pow(2, dataView.getUint8(nextOffset + 1)),
                metronome: dataView.getUint8(nextOffset + 2),
                numerator: dataView.getUint8(nextOffset),
                thirtyseconds: dataView.getUint8(nextOffset + 3)
            }
        };
    } else if (metaTypeByte === 0x59) { // tslint:disable-line:no-bitwise

        // @todo length must be 2

        event = <IMidiKeySignatureEvent> {
            keySignature: {
                key: dataView.getInt8(nextOffset),
                scale: dataView.getInt8(nextOffset + 1)
            }
        };
    } else if (metaTypeByte === 0x7F) { // tslint:disable-line:no-bitwise
        event = <IMidiSequencerSpecificEvent> {
            sequencerSpecificData: hexify(dataView, nextOffset, length)
        };
    } else {
        throw new Error(`Cannot parse a meta event with a type of "${ metaTypeByte.toString(16) }"`);
    }

    return {
        event,
        offset: nextOffset + length
    };
};

const _parseMidiEvent =
        (statusByte: number, dataView: DataView, offset: number, lastEvent: null | TMidiEvent): { event: TMidiEvent; offset: number } => {
    const eventType = statusByte >> 4; // tslint:disable-line:no-bitwise
    const sanitizedLastEvent = ((statusByte & 0x80) === 0) ? lastEvent : null; // tslint:disable-line:no-bitwise
    const isRunningStatus = sanitizedLastEvent !== null; // tslint:disable-line:no-bitwise

    let event: TMidiEvent;
    let sanitizedOffset = isRunningStatus ? offset - 1 : offset; // tslint:disable-line:no-bitwise

    if (eventType === 0x08 || (isRunningStatus && 'noteOff' in <TMidiEvent> sanitizedLastEvent)) { // tslint:disable-line:no-bitwise
        event = <IMidiNoteOffEvent> {
            noteOff: {
                noteNumber: dataView.getUint8(sanitizedOffset),
                velocity: dataView.getUint8(sanitizedOffset + 1)
            }
        };

        sanitizedOffset += 2;
    } else if (eventType === 0x09 || (isRunningStatus && 'noteOn' in <TMidiEvent> sanitizedLastEvent)) { // tslint:disable-line:no-bitwise
        const noteNumber = dataView.getUint8(sanitizedOffset);

        const velocity = dataView.getUint8(sanitizedOffset + 1);

        if (velocity === 0) {
            event = <IMidiNoteOffEvent> {
                noteOff: {
                    noteNumber,
                    velocity
                }
            };
        } else {
            event = <IMidiNoteOnEvent> {
                noteOn: {
                    noteNumber,
                    velocity
                }
            };
        }

        sanitizedOffset += 2;
    } else if (eventType === 0x0B
            || (isRunningStatus && 'controlChange' in <TMidiEvent> sanitizedLastEvent)) { // tslint:disable-line:no-bitwise
        event = <IMidiControlChangeEvent> {
            controlChange: {
                type: dataView.getUint8(sanitizedOffset),
                value: dataView.getUint8(sanitizedOffset + 1)
            }
        };

        sanitizedOffset += 2;
    } else if (eventType === 0x0C
            || (isRunningStatus && 'programChange' in <TMidiEvent> sanitizedLastEvent)) { // tslint:disable-line:no-bitwise
        event = <IMidiProgramChangeEvent> {
            programChange: {
                programNumber: dataView.getUint8(sanitizedOffset)
            }
        };

        sanitizedOffset += 1;
    } else if (eventType === 0x0E
            || (isRunningStatus && 'pitchBend' in <TMidiEvent> sanitizedLastEvent)) { // tslint:disable-line:no-bitwise
        event = <IMidiPitchBendEvent> {
            pitchBend: dataView.getUint8(sanitizedOffset) | (dataView.getUint8(sanitizedOffset + 1) << 7) // tslint:disable-line:no-bitwise
        };

        sanitizedOffset += 2;
    } else {
        throw new Error(`Cannot parse a midi event with a type of "${ eventType.toString(16) }"`);
    }

    event.channel = (isRunningStatus) ? (<TMidiEvent> sanitizedLastEvent).channel : statusByte & 0x0F;  // tslint:disable-line:no-bitwise

    return { event, offset: sanitizedOffset };
};

const _parseSysexEvent = (dataView: DataView, offset: number): { event: IMidiSysexEvent; offset: number } => {
    const { offset: nextOffset, value: length } = _readVariableLengthQuantity( // tslint:disable-line:no-use-before-declare
        dataView,
        offset
    );

    return {
        event: <IMidiSysexEvent> {
            sysex: hexify(dataView, nextOffset, length)
        },
        offset: nextOffset + length
    };
};

const _parseTrackChunk = (dataView: DataView, offset: number) => {
    if (stringify(dataView, offset, 4) !== 'MTrk') {
        throw new Error(`Unexpected characters "${ stringify(dataView, offset, 4) }" found instead of "MTrk"`);
    }

    const events = [];
    const length = dataView.getUint32(offset + 4) + offset + 8;

    let event = null;
    let nextOffset = offset + 8;

    while (nextOffset < length) {
        ({ event, offset: nextOffset } = _parseEvent(dataView, nextOffset, event));

        events.push(event);
    }

    return {
        offset: nextOffset,
        track: events
    };
};

const _readVariableLengthQuantity = (dataView: DataView, offset: number) => {
    let nextOffset = offset;
    let value = 0;

    while (true) {
        const byte = dataView.getUint8(nextOffset);

        nextOffset += 1;

        if (byte > 127) {
            value += (byte & 0x7F); // tslint:disable-line:no-bitwise
            value <<= 7; // tslint:disable-line:no-bitwise
        } else {
            value += byte;

            return {
                offset: nextOffset,
                value
            };
        }
    }
};
