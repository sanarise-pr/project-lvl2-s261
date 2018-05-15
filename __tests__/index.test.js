import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const buildFixturePath = fileName =>
  path.join(__dirname, '__fixtures__', fileName);

describe('genDiff', () => {
  it('JSON format', () => {
    const fixtures = ['before.json', 'after.json', 'expected-diff'];
    const [beforePath, afterPath, expectedDiffPath] = fixtures.map(buildFixturePath);
    const expectedDiff = fs.readFileSync(expectedDiffPath, 'utf-8').trim();

    expect(genDiff(beforePath, afterPath)).toEqual(expectedDiff);
  });

  it('YAML format', () => {
    const fixtures = ['before.yml', 'after.yml', 'expected-diff'];
    const [beforePath, afterPath, expectedDiffPath] = fixtures.map(buildFixturePath);
    const expectedDiff = fs.readFileSync(expectedDiffPath, 'utf-8').trim();

    expect(genDiff(beforePath, afterPath)).toEqual(expectedDiff);
  });

  it('unknown format throws error', () => {
    const fixtures = ['before.unknown', 'after.yml'];
    const [beforePath, afterPath] = fixtures.map(buildFixturePath);

    expect(() => genDiff(beforePath, afterPath)).toThrow('Unknown format: ".unknown"');
  });
});
