import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';
import { filenames } from '../helper/filenames';

describe('module', () => {
    let id;
    let worker;

    afterEach(() => worker.terminate());

    beforeEach(() => {
        id = 63;

        worker = new Worker(new URL('../../src/module', import.meta.url), { type: 'module' });
    });

    for (const filename of filenames) {
        describe('with a midi file', () => {
            let arrayBuffer;
            let midiFile;

            beforeEach(async () => {
                arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
                midiFile = await loadFixtureAsJson(`${filename}.json`);
            });

            it('should parse the file', () => {
                const { promise, resolve } = Promise.withResolvers();

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        id,
                        result: midiFile
                    });

                    resolve();
                });

                worker.postMessage(
                    {
                        id,
                        method: 'parse',
                        params: { arrayBuffer }
                    },
                    [arrayBuffer]
                );

                return promise;
            });
        });

        describe('with a json file', () => {
            let arrayBuffer;

            beforeEach(async () => {
                arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.json`);
            });

            it('should refuse to parse the file', () => {
                const { promise, resolve } = Promise.withResolvers();

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            code: -32603,
                            message: 'Unexpected characters "{\n  " found instead of "MThd"'
                        },
                        id
                    });

                    resolve();
                });

                worker.postMessage(
                    {
                        id,
                        method: 'parse',
                        params: { arrayBuffer }
                    },
                    [arrayBuffer]
                );

                return promise;
            });
        });
    }

    describe('with a too small file', () => {
        let arrayBuffer;

        beforeEach(() => (arrayBuffer = new ArrayBuffer(13)));

        it('should refuse to parse the file', () => {
            const { promise, resolve } = Promise.withResolvers();

            worker.addEventListener('message', ({ data }) => {
                expect(data).to.deep.equal({
                    error: {
                        code: -32603,
                        message: 'Expected at least 14 bytes instead of 13'
                    },
                    id
                });

                resolve();
            });

            worker.postMessage(
                {
                    id,
                    method: 'parse',
                    params: { arrayBuffer }
                },
                [arrayBuffer]
            );

            return promise;
        });
    });
});
