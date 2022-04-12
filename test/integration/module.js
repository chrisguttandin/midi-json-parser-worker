import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';
import { filenames } from '../helper/filenames';

describe('module', () => {
    afterEach((done) => {
        // @todo This is an optimistic fix to prevent the famous 'Some of your tests did a full page reload!' error.
        setTimeout(done, 1000);
    });

    for (const filename of filenames) {
        let id;
        let worker;

        afterEach(() => worker.terminate());

        beforeEach(() => {
            id = 63;

            worker = new Worker('base/src/module.js');
        });

        describe('with a midi file', () => {
            let arrayBuffer;
            let midiFile;

            beforeEach(async function () {
                this.timeout(30000);

                arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
                midiFile = await loadFixtureAsJson(`${filename}.json`);
            });

            it('should parse the file', function (done) {
                this.timeout(20000);

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        id,
                        result: midiFile
                    });

                    done();
                });

                worker.postMessage(
                    {
                        id,
                        method: 'parse',
                        params: { arrayBuffer }
                    },
                    [arrayBuffer]
                );
            });
        });

        describe('with a json file', () => {
            let arrayBuffer;

            beforeEach(async function () {
                this.timeout(20000);

                arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.json`);
            });

            it('should refuse to parse the file', function (done) {
                this.timeout(20000);

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            code: -32603,
                            message: 'Unexpected characters "{\n  " found instead of "MThd"'
                        },
                        id
                    });

                    done();
                });

                worker.postMessage(
                    {
                        id,
                        method: 'parse',
                        params: { arrayBuffer }
                    },
                    [arrayBuffer]
                );
            });
        });
    }
});
