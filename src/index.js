import fs from 'fs';
import _ from 'lodash';

const readAndParseJsonSync = (path) => {
  const json = fs.readFileSync(path, 'utf-8');
  return JSON.parse(json);
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
  const keySet = new Set([...Object.keys(before), ...Object.keys(after)]);

  return Array.from(keySet).map((key) => {
    const { status } = changeMapping.find(rec => rec.test(key));
    return [key, status];
  });
};

const genDiff = (beforePath, afterPath) => {
  const before = readAndParseJsonSync(beforePath);
  const after = readAndParseJsonSync(afterPath);
  const changeTable = buildChangeTable(before, after);

  return buildReport(changeTable, before, after);
};

export default genDiff;
