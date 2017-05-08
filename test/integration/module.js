import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';
import { transferSlice } from '../helper/transfer-slice';

describe('module', () => {

    leche.withData([ // eslint-disable-line no-undef
        ['because'],
        ['scale'],
        ['SubTractor 1'],
        ['SubTractor 2']
    ], (filename) => {

        let worker;

        beforeEach(() => {
            worker = new Worker('base/src/module.ts');
        });

        it('should parse the midi file', function (done) {
            this.timeout(6000);

            loadFixtureAsJson(filename + '.json', (err, json) => {
                expect(err).to.be.null;

                loadFixtureAsArrayBuffer(filename + '.mid', (err, arrayBuffer) => {
                    expect(err).to.be.null;

                    worker.addEventListener('message', ({ data }) => {
                        expect(data).to.deep.equal({
                            index: 0,
                            midiFile: json
                        });

                        done();
                    });

                    transferSlice(arrayBuffer, worker, 0);
                });
            });
        });

        it('should refuse to parse a none midi file', function (done) {
            this.timeout(6000);

            loadFixtureAsArrayBuffer(filename + '.json', (err, arrayBuffer) => {
                expect(err).to.be.null;

                worker.addEventListener('message', ({ data }) => {
                    expect(data).to.deep.equal({
                        err: {
                            message: 'Unexpected characters "{\n  " found instead of "MThd"'
                        },
                        index: 0,
                        midiFile: null
                    });

                    done();
                });

                transferSlice(arrayBuffer, worker, 0);
            });
        });

    });

});
