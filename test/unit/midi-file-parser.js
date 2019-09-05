import * as midiFileParser from '../../src/midi-file-parser';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';

describe('midiFileParser', () => {

    describe('parseArrayBuffer()', () => {

        leche.withData([
            [ '98137' ],
            [ 'A_F_NO7_01' ],
            [ 'MIDIOkFormat1-lyrics' ],
            [ 'MIDIOkFormat2' ],
            [ 'SubTractor 1' ],
            [ 'SubTractor 2' ],
            [ 'TheEntertainer' ],
            [ 'because' ],
            [ 'californication' ],
            [ 'minute_waltz' ],
            [ 'rachmaninov3' ],
            [ 'scale' ],
            [ 'test' ],
            [ 'test8bars' ]
        ], (filename) => {

            describe('with a midi file', () => {

                let arrayBuffer;
                let midiFile;

                beforeEach(async function () {
                    this.timeout(6000);

                    arrayBuffer = await loadFixtureAsArrayBuffer(`${ filename }.mid`);
                    midiFile = await loadFixtureAsJson(`${ filename }.json`);
                });

                it('should parse the file', function () {
                    this.timeout(6000);

                    expect(midiFileParser.parseArrayBuffer(arrayBuffer)).to.deep.equal(midiFile);
                });

            });

            describe('with a json file', () => {

                let arrayBuffer;

                beforeEach(async function () {
                    this.timeout(6000);

                    arrayBuffer = await loadFixtureAsArrayBuffer(`${ filename }.json`);
                });

                it('should refuse to parse the file', function () {
                    this.timeout(6000);

                    expect(() => {
                        midiFileParser.parseArrayBuffer(arrayBuffer);
                    }).to.throw(Error, 'Unexpected characters "{\n  " found instead of "MThd"');
                });

            });

        });

    });

});
