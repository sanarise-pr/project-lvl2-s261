import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const buildFixturePath = fileName =>
  path.join(__dirname, '__fixtures__', fileName);

describe('genDiff', () => {
  describe('valid formats', () => {
    let expectedDiff;

    beforeAll(() => {
      const expectedDiffPath = buildFixturePath('expected-diff');
      expectedDiff = fs.readFileSync(expectedDiffPath, 'utf-8').trim();
    });

    it('JSON format', () => {
      const fixtures = ['before.json', 'after.json'];
      const [beforePath, afterPath] = fixtures.map(buildFixturePath);

      expect(genDiff(beforePath, afterPath)).toEqual(expectedDiff);
    });

    it('YAML format', () => {
      const fixtures = ['before.yml', 'after.yml'];
      const [beforePath, afterPath] = fixtures.map(buildFixturePath);

      expect(genDiff(beforePath, afterPath)).toEqual(expectedDiff);
    });

    it('INI format', () => {
      const fixtures = ['before.ini', 'after.ini'];
      const [beforePath, afterPath] = fixtures.map(buildFixturePath);

      expect(genDiff(beforePath, afterPath)).toEqual(expectedDiff);
    });
  });

  it('unknown format throws error', () => {
    const fixtures = ['before.unknown', 'after.yml'];
    const [beforePath, afterPath] = fixtures.map(buildFixturePath);

    expect(() => genDiff(beforePath, afterPath)).toThrow('Unknown format: ".unknown"');
  });
});
