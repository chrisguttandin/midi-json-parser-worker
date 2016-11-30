export const transferSlice = (arrayBuffer, worker, byteIndex) => {
    if (byteIndex + 1048576 < arrayBuffer.byteLength) {
        const slice = arrayBuffer.slice(byteIndex, byteIndex + 1048576);

        worker.postMessage({
            arrayBuffer: slice,
            byteIndex,
            byteLength: arrayBuffer.byteLength,
            index: 0
        }, [
            slice
        ]);

        transferSlice(arrayBuffer, worker, byteIndex + 1048576);
    } else {
        const slice = arrayBuffer.slice(byteIndex);

        worker.postMessage({
            arrayBuffer: slice,
            byteIndex,
            byteLength: arrayBuffer.byteLength,
            index: 0
        }, [
            slice
        ]);
    }
};
