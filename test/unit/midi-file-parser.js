import * as midiFileParser from '../../src/midi-file-parser';
import { loadFixtureAsArrayBuffer, loadFixtureAsJson } from '../helper/load-fixture';
import { filenames } from '../helper/filenames';

describe('midiFileParser', () => {
    describe('parseArrayBuffer()', () => {
        for (const filename of filenames) {
            describe('with a midi file', () => {
                let arrayBuffer;
                let midiFile;

                beforeEach(async function () {
                    this.timeout(20000);

                    arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.mid`);
                    midiFile = await loadFixtureAsJson(`${filename}.json`);
                });

                it('should parse the file', function () {
                    this.timeout(20000);

                    expect(midiFileParser.parseArrayBuffer(arrayBuffer)).to.deep.equal(midiFile);
                });
            });

            describe('with a json file', () => {
                let arrayBuffer;

                beforeEach(async function () {
                    this.timeout(20000);

                    arrayBuffer = await loadFixtureAsArrayBuffer(`${filename}.json`);
                });

                it('should refuse to parse the file', function () {
                    this.timeout(20000);

                    expect(() => {
                        midiFileParser.parseArrayBuffer(arrayBuffer);
                    }).to.throw(Error, 'Unexpected characters "{\n  " found instead of "MThd"');
                });
            });
        }
    });
});
