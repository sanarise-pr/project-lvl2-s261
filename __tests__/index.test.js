import fs from 'fs';
import path from 'path';
import genDiff from '../src';
import { renderJsonLike, renderPlainText } from '../src/renderers';

const buildFixturePath = fileName =>
  path.join(__dirname, '__fixtures__', fileName);

describe('genDiff', () => {
  describe('valid input formats', () => {
    let expectedDiff;

    beforeAll(() => {
      const expectedDiffPath = buildFixturePath('expected-json-like');
      expectedDiff = fs.readFileSync(expectedDiffPath, 'utf-8').trim();
    });

    it('json format', () => {
      const fixtures = ['before.json', 'after.json'];
      const [beforePath, afterPath] = fixtures.map(buildFixturePath);

      expect(genDiff(beforePath, afterPath)).toEqual(expectedDiff);
    });

    it('yaml format', () => {
      const fixtures = ['before.yml', 'after.yml'];
      const [beforePath, afterPath] = fixtures.map(buildFixturePath);

      expect(genDiff(beforePath, afterPath)).toEqual(expectedDiff);
    });

    it('ini format', () => {
      const fixtures = ['before.ini', 'after.ini'];
      const [beforePath, afterPath] = fixtures.map(buildFixturePath);

      expect(genDiff(beforePath, afterPath)).toEqual(expectedDiff);
    });
  });

  describe('output renderers', () => {
    let beforePath;
    let afterPath;
    beforeAll(() => {
      const fixtures = ['before.json', 'after.json'];
      [beforePath, afterPath] = fixtures.map(buildFixturePath);
    });

    it('json-like renderer', () => {
      const expectedDiffPath = buildFixturePath('expected-json-like');
      const expectedDiff = fs.readFileSync(expectedDiffPath, 'utf-8').trim();

      expect(genDiff(beforePath, afterPath, renderJsonLike)).toEqual(expectedDiff);
    });

    it('plain-text renderer', () => {
      const expectedDiffPath = buildFixturePath('expected-plain-text');
      const expectedDiff = fs.readFileSync(expectedDiffPath, 'utf-8').trim();

      expect(genDiff(beforePath, afterPath, renderPlainText)).toEqual(expectedDiff);
    });
  });

  it('unknown input format throws error', () => {
    const fixtures = ['before.unknown', 'after.yml'];
    const [beforePath, afterPath] = fixtures.map(buildFixturePath);

    expect(() => genDiff(beforePath, afterPath)).toThrow('Unknown format: ".unknown"');
  });
});
