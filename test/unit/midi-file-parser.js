import * as midiFileParser from '../../src/midi-file-parser';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('midiFileParser', () => {

    describe('parseArrayBuffer()', () => {

        leche.withData([
            [ 'because' ],
            [ 'MIDIOkFormat1-lyrics' ],
            [ 'MIDIOkFormat2' ],
            [ 'scale' ],
            [ 'SubTractor 1' ],
            [ 'SubTractor 2' ]
        ], (filename) => {

            it('should parse the midi file', function (done) {
                this.timeout(6000);

                loadFixtureAsJson(filename + '.json', (err, json) => {
                    expect(err).to.be.null;

                    loadFixtureAsArrayBuffer(filename + '.mid', (err, arrayBuffer) => {
                        expect(err).to.be.null;

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
