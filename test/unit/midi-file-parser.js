import * as midiFileParser from '../../src/midi-file-parser';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('midiFileParser', () => {

    describe('parseArrayBuffer()', () => {

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

            it('should parse the midi file', function (done) {
                this.timeout(6000);

                loadFixtureAsJson(filename + '.json', (err, json) => {
                    expect(err).to.be.null;

                    loadFixtureAsArrayBuffer(filename + '.mid', (rr, arrayBuffer) => {
                        expect(rr).to.be.null;

                        expect(midiFileParser.parseArrayBuffer(arrayBuffer)).to.deep.equal(json);

                        done();
                    });
                });
            });

            it('should refuse to parse a none midi file', function (done) {
                this.timeout(6000);

                loadFixtureAsArrayBuffer(filename + '.json', (err, arrayBuffer) => {
                    expect(err).to.be.null;

                    expect(() => {
                        midiFileParser.parseArrayBuffer(arrayBuffer);
                    }).to.throw(Error, 'Unexpected characters "{\n  " found instead of "MThd"');

                    done();
                });
            });

        });

    });

});
