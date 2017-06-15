import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('module', () => {

    leche.withData([ // eslint-disable-line no-undef
        [ 'because' ],
        [ 'scale' ],
        [ 'SubTractor 1' ],
        [ 'SubTractor 2' ]
    ], (filename) => {

        let id;
        let worker;

        beforeEach(() => {
            id = 63;

            worker = new Worker('base/src/module.ts');
        });

        it('should parse the midi file', function (done) {
            this.timeout(6000);

            loadFixtureAsJson(filename + '.json', (err, midiFile) => {
                expect(err).to.be.null;

                loadFixtureAsArrayBuffer(filename + '.mid', (err, arrayBuffer) => {
                    expect(err).to.be.null;

                    worker.addEventListener('message', ({ data }) => {
                        expect(data).to.deep.equal({
                            error: null,
                            id,
                            result: { midiFile }
                        });

                        done();
                    });

                    worker.postMessage({
                        id,
                        method: 'parse',
                        params: { arrayBuffer }
                    }, [
                        arrayBuffer
                    ]);
                });
            });
        });

        it('should refuse to parse a none midi file', function (done) {
            this.timeout(6000);

            loadFixtureAsArrayBuffer(filename + '.json', (err, arrayBuffer) => {
                expect(err).to.be.null;

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        error: {
                            message: 'Unexpected characters "{\n  " found instead of "MThd"'
                        },
                        id,
                        result: null
                    });

                    done();
                });

                worker.postMessage({
                    id,
                    method: 'parse',
                    params: { arrayBuffer }
                }, [
                    arrayBuffer
                ]);
            });
        });

    });

});
