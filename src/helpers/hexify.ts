/**
 * This function turns a part of a given ArrayBuffer into a hexadecimal String.
 */
export const hexify = (dataView: DataView, offset = 0, length = dataView.byteLength - (offset - dataView.byteOffset)) => {
    const byteOffset = offset + dataView.byteOffset;

    const hexArray = [];

    const uint8Array = new Uint8Array(dataView.buffer, byteOffset, length);

    for (let i = 0; i < length; i += 1) {
        let hex = uint8Array[i]
            .toString(16)
            .toUpperCase();

        if (hex.length === 1) {
            hex = 0 + hex;
        }

        hexArray[i] = hex;
    }

    return hexArray.join('');
};
