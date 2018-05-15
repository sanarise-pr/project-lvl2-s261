import fs from 'fs';
import path from 'path';
import genDiff from '../src';

describe('genDiff', () => {
  it('JSON format', () => {
    const beforePath = path.join(__dirname, '__fixtures__', 'before.json');
    const afterPath = path.join(__dirname, '__fixtures__', 'after.json');

    const expectedDiffPath = path.join(__dirname, '__fixtures__', 'expected-diff');
    const expectedDiff = fs.readFileSync(expectedDiffPath, 'utf-8').trim();

    expect(genDiff(beforePath, afterPath)).toEqual(expectedDiff);
  });

  it('YAML format', () => {
    const beforePath = path.join(__dirname, '__fixtures__', 'before.yml');
    const afterPath = path.join(__dirname, '__fixtures__', 'after.yml');

    const expectedDiffPath = path.join(__dirname, '__fixtures__', 'expected-diff');
    const expectedDiff = fs.readFileSync(expectedDiffPath, 'utf-8').trim();

    expect(genDiff(beforePath, afterPath)).toEqual(expectedDiff);
  });

  it('unknown format throws error', () => {
    const beforePath = path.join(__dirname, '__fixtures__', 'before.unknown');
    const afterPath = path.join(__dirname, '__fixtures__', 'after.yml');

    expect(() => genDiff(beforePath, afterPath)).toThrow('Unknown format: ".unknown"');
  });
});
