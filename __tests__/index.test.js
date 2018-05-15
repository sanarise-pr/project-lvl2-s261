import fs from 'fs';
import path from 'path';
import genDiff from '../src';

test('genDiff', () => {
  const beforePath = path.join(__dirname, '__fixtures__', 'before.json');
  const afterPath = path.join(__dirname, '__fixtures__', 'after.json');

  const expectedDiffPath = path.join(__dirname, '__fixtures__', 'expected-diff');
  const expectedDiff = fs.readFileSync(expectedDiffPath, 'utf-8').trim();

  expect(genDiff(beforePath, afterPath)).toEqual(expectedDiff);
});
