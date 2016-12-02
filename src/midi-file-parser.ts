import { hexify } from './helpers/hexify';
import { stringify } from './helpers/stringify';

export const parseArrayBuffer = (arrayBuffer) => {
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

const _parseEvent = (dataView, offset, lastEvent) => {
    let delta;

    let result;

    ({ offset, value: delta } = _readVariableLengthQuantity(dataView, offset)); // tslint:disable-line:no-use-before-declare

    const eventTypeByte = dataView.getUint8(offset);

    if (eventTypeByte === 0xF0) {  // tslint:disable-line:no-bitwise
        result = _parseSysexEvent(dataView, offset + 1); // tslint:disable-line:no-use-before-declare
    } else if (eventTypeByte === 0xFF) {  // tslint:disable-line:no-bitwise
        result = _parseMetaEvent(dataView, offset + 1); // tslint:disable-line:no-use-before-declare
    } else {
        result = _parseMidiEvent(eventTypeByte, dataView, offset + 1, lastEvent); // tslint:disable-line:no-use-before-declare
    }

    result.event.delta = delta;

    return result;
};

const _parseHeaderChunk = (dataView) => {
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

const _parseMetaEvent = (dataView, offset) => {
    let event;

    let length;

    const metaTypeByte = dataView.getUint8(offset);

    ({ offset, value: length } = _readVariableLengthQuantity(dataView, offset + 1)); // tslint:disable-line:no-use-before-declare

    if (metaTypeByte === 0x03) {  // tslint:disable-line:no-bitwise
        event = {
            trackName: stringify(dataView, offset, length)
        };
    } else if (metaTypeByte === 0x20) {  // tslint:disable-line:no-bitwise
        event = {
            channelPrefix: dataView.getUint8(offset)
        };
    } else if (metaTypeByte === 0x21) {  // tslint:disable-line:no-bitwise
        event = {
            midiPort: dataView.getUint8(offset)
        };
    } else if (metaTypeByte === 0x2F) {  // tslint:disable-line:no-bitwise

        // @todo length must be 0

        event = {
            endOfTrack: true
        };
    } else if (metaTypeByte === 0x51) {  // tslint:disable-line:no-bitwise

        // @todo length must be 5

        event = {
            setTempo: {
                microsecondsPerBeat: (
                    (dataView.getUint8(offset) << 16) + // tslint:disable-line:no-bitwise
                    (dataView.getUint8(offset + 1) << 8) + // tslint:disable-line:no-bitwise
                    dataView.getUint8(offset + 2)
                )
            }
        };
    } else if (metaTypeByte === 0x54) {  // tslint:disable-line:no-bitwise
        let frameRate;

        // @todo length must be 5

        const hourByte = dataView.getUint8(offset);

        if ((hourByte & 0x60) === 0x00) {  // tslint:disable-line:no-bitwise
            frameRate = 24;
        } else if ((hourByte & 0x60) === 0x20) {  // tslint:disable-line:no-bitwise
            frameRate = 25;
        } else if ((hourByte & 0x60) === 0x40) {  // tslint:disable-line:no-bitwise
            frameRate = 29;
        } else if ((hourByte & 0x60) === 0x60) {  // tslint:disable-line:no-bitwise
            frameRate = 30;
        }

        event = {
            smpteOffset: {
                frame: dataView.getUint8(offset + 3),
                frameRate,
                hour: hourByte & 0x1F,  // tslint:disable-line:no-bitwise
                minutes: dataView.getUint8(offset + 1),
                seconds: dataView.getUint8(offset + 2),
                subFrame: dataView.getUint8(offset + 4)
            }
        };
    } else if (metaTypeByte === 0x58) {  // tslint:disable-line:no-bitwise
        event = {
            timeSignature: {
                denominator: Math.pow(2, dataView.getUint8(offset + 1)),
                metronome: dataView.getUint8(offset + 2),
                numerator: dataView.getUint8(offset),
                thirtyseconds: dataView.getUint8(offset + 3)
            }
        };
    } else if (metaTypeByte === 0x59) {  // tslint:disable-line:no-bitwise

        // @todo length must be 2

        event = {
            keySignature: {
                key: dataView.getInt8(offset),
                scale: dataView.getInt8(offset + 1)
            }
        };
    } else {
        throw new Error(`Cannot parse a meta event with a type of "${ metaTypeByte.toString(16) }"`);
    }

    return {
        event,
        offset: offset + length
    };
};

const _parseMidiEvent = (statusByte, dataView, offset, lastEvent) => {
    let event;

    const eventType = statusByte >> 4; // tslint:disable-line:no-bitwise

    if ((statusByte & 0x80) === 0) {  // tslint:disable-line:no-bitwise
        offset -= 1;
    } else {
        lastEvent = null;
    }

    if (eventType === 0x08 || (lastEvent !== null && lastEvent.noteOff !== undefined)) {  // tslint:disable-line:no-bitwise
        event = {
            noteOff: {
                noteNumber: dataView.getUint8(offset),
                velocity: dataView.getUint8(offset + 1)
            }
        };

        offset += 2;
    } else if (eventType === 0x09 || (lastEvent !== null && lastEvent.noteOn !== undefined)) {  // tslint:disable-line:no-bitwise
        const noteNumber = dataView.getUint8(offset);

        const velocity = dataView.getUint8(offset + 1);

        if (velocity === 0) {
            event = {
                noteOff: {
                    noteNumber,
                    velocity
                }
            };
        } else {
            event = {
                noteOn: {
                    noteNumber,
                    velocity
                }
            };
        }

        offset += 2;
    } else if (eventType === 0x0B || (lastEvent !== null && lastEvent.controlChange !== undefined)) {  // tslint:disable-line:no-bitwise
        event = {
            controlChange: {
                type: dataView.getUint8(offset),
                value: dataView.getUint8(offset + 1)
            }
        };

        offset += 2;
    } else if (eventType === 0x0C || (lastEvent !== null && lastEvent.programChange !== undefined)) {  // tslint:disable-line:no-bitwise
        event = {
            programChange: {
                programNumber: dataView.getUint8(offset)
            }
        };

        offset += 1;
    } else if (eventType === 0x0E || (lastEvent !== null && lastEvent.pitchBend !== undefined)) {  // tslint:disable-line:no-bitwise
        event = {
            pitchBend: dataView.getUint8(offset) | (dataView.getUint8(offset + 1) << 7) // tslint:disable-line:no-bitwise
        };

        offset += 2;
    } else {
        throw new Error(`Cannot parse a midi event with a type of "${ eventType.toString(16) }"`);
    }

    event.channel = statusByte & 0x0F;  // tslint:disable-line:no-bitwise

    return { event, offset };
};

const _parseSysexEvent = (dataView, offset) => {
    let length;

    ({ offset, value: length } = _readVariableLengthQuantity(dataView, offset)); // tslint:disable-line:no-use-before-declare

    return {
        event: {
            sysex: hexify(dataView, offset, length)
        },
        offset: offset + length
    };
};

const _parseTrackChunk = (dataView, offset) => {
    if (stringify(dataView, offset, 4) !== 'MTrk') {
        throw new Error(`Unexpected characters "${ stringify(dataView, offset, 4) }" found instead of "MTrk"`);
    }

    let event = null;

    const events = [];

    const length = dataView.getUint32(offset + 4) + offset + 8;

    offset += 8;

    while (offset < length) {
        ({ event, offset } = _parseEvent(dataView, offset, event));

        events.push(event);
    }

    return {
        offset,
        track: events
    };
};

const _readVariableLengthQuantity = (dataView, offset) => {
    let value = 0;

    while (true) {
        let byte = dataView.getUint8(offset);

        offset += 1;

        if (byte > 127) {
            value += (byte & 0x7F); // tslint:disable-line:no-bitwise
            value <<= 7; // tslint:disable-line:no-bitwise
        } else {
            value += byte;

            return {
                offset,
                value
            };
        }
    }
};
