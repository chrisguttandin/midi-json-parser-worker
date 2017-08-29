/**
 * This function turns a part of a given ArrayBuffer into a String.
 */
export const stringify = (dataView: DataView, offset = 0, length = dataView.byteLength - (offset - dataView.byteOffset)) => {
    const byteOffset = offset + dataView.byteOffset;

    const array = new Uint8Array(dataView.buffer, byteOffset, length);

    return String.fromCharCode.apply(null, array);
};
