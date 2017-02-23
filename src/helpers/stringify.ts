/**
 * This function turns a part of a given ArrayBuffer into a String.
 */
export const stringify = (dataView: DataView, offset = 0, length = dataView.byteLength - (offset - dataView.byteOffset)) => {
    offset += dataView.byteOffset;

    const array = new Uint8Array(dataView.buffer, offset, length);

    return String.fromCharCode.apply(null, array);
};
