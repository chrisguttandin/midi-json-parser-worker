import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('module', () => {

    afterEach((done) => {
        // @todo This is an optimistic fix to prevent the famous 'Some of your tests did a full page reload!' error.
        setTimeout(done, 1000);
    });

    leche.withData([
        [ '98137' ],
        [ 'A_F_NO7_01' ],
        [ 'MIDIOkFormat1-lyrics' ],
        [ 'MIDIOkFormat2' ],
        [ 'SubTractor 1' ],
        [ 'SubTractor 2' ],
        [ 'TheEntertainer' ],
        [ 'because' ],
        [ 'minute_waltz' ],
        [ 'rachmaninov3' ],
        [ 'scale' ],
        [ 'test' ],
        [ 'test8bars' ]
    ], (filename) => {

        let id;
        let worker;

        beforeEach(() => {
            id = 63;

            worker = new Worker('base/src/module.js');
        });

        describe('with a midi file', () => {

            let arrayBuffer;
            let midiFile;

            beforeEach(async function () {
                this.timeout(10000);

                arrayBuffer = await loadFixtureAsArrayBuffer(`${ filename }.mid`);
                midiFile = await loadFixtureAsJson(`${ filename }.json`);
            });

            it('should parse the file', function (done) {
                this.timeout(10000);

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

        describe('with a json file', () => {

            let arrayBuffer;

            beforeEach(async function () {
                this.timeout(10000);

                arrayBuffer = await loadFixtureAsArrayBuffer(`${ filename }.json`);
            });

            it('should refuse to parse the file', function (done) {
                this.timeout(10000);

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
