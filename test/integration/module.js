import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('module', () => {

    afterEach((done) => {
        // @todo This is an optimistic fix to prevent the famous 'Some of your tests did a full page reload!' error.
        setTimeout(done, 1000);
    });

    leche.withData([
        [ 'A_F_NO7_01' ],
        [ 'because' ],
        [ 'MIDIOkFormat1-lyrics' ],
        [ 'MIDIOkFormat2' ],
        [ 'minute_waltz' ],
        [ 'rachmaninov3' ],
        [ 'scale' ],
        [ 'SubTractor 1' ],
        [ 'SubTractor 2' ],
        [ 'test' ],
        [ 'test8bars' ]
    ], (filename) => {

        let id;
        let worker;

        beforeEach(() => {
            id = 63;

            worker = new Worker('base/src/module.js');
        });

        it('should parse the midi file', function (done) {
            this.timeout(6000);

            loadFixtureAsJson(filename + '.json', (err, midiFile) => {
                expect(err).to.be.null;

                loadFixtureAsArrayBuffer(filename + '.mid', (rr, arrayBuffer) => {
                    expect(rr).to.be.null;

                    worker.addEventListener('message', ({ data }) => {
                        expect(data).to.deep.equal({
                            id,
                            result: midiFile
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
                            code: -32603,
                            message: 'Unexpected characters "{\n  " found instead of "MThd"'
                        },
                        id
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
