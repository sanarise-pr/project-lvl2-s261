import fs from 'fs';
import { extname } from 'path';
import _ from 'lodash';
import getParser from './parsers';

const readAndParseSync = (path) => {
  const rawData = fs.readFileSync(path, 'utf-8');
  const pathExtName = extname(path);
  const parse = getParser(pathExtName);

  return parse(rawData);
};

const buildReport = (changeTable, before, after) => {
  const reportMapping = {
    added: key => `  + ${key}: ${after[key]}`,
    removed: key => `  - ${key}: ${before[key]}`,
    unchanged: key => `    ${key}: ${before[key]}`,
    changed: key => [`  + ${key}: ${after[key]}`, `  - ${key}: ${before[key]}`],
  };
  const reportStrings = changeTable
    .map(([key, status]) => reportMapping[status](key));

  return ['{', ..._.flatten(reportStrings), '}'].join('\n');
};

const buildChangeTable = (before, after) => {
  const changeMapping = [
    {
      status: 'added',
      test: key => !_.has(before, key) && _.has(after, key),
    },
    {
      status: 'removed',
      test: key => _.has(before, key) && !_.has(after, key),
    },
    {
      status: 'unchanged',
      test: key =>
        _.has(before, key) && _.has(after, key) && before[key] === after[key],
    },
    {
      status: 'changed',
      test: key =>
        _.has(before, key) && _.has(after, key) && before[key] !== after[key],
    },
  ];
  const keys = _.union(_.keys(before), _.keys(after));

  return keys.map((key) => {
    const { status } = changeMapping.find(rec => rec.test(key));
    return [key, status];
  });
};

const genDiff = (beforePath, afterPath) => {
  const before = readAndParseSync(beforePath);
  const after = readAndParseSync(afterPath);
  const changeTable = buildChangeTable(before, after);

  return buildReport(changeTable, before, after);
};

export default genDiff;
