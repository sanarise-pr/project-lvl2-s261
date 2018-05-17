/* eslint no-use-before-define: ["error", { "variables": false }] */
import _ from 'lodash';

const createAstMapping = (before, after) => [
  {
    test: key => !_.has(before, key) && _.has(after, key),
    build: key => ({
      type: 'added',
      value: after[key],
    }),
  },
  {
    test: key => _.has(before, key) && !_.has(after, key),
    build: key => ({
      type: 'removed',
      value: before[key],
    }),
  },
  {
    test: key => _.isPlainObject(before[key]) && _.isPlainObject(after[key]),
    build: key => ({
      type: 'nested',
      children: buildDiffAst(before[key], after[key]),
    }),
  },
  {
    test: key =>
      _.has(before, key) && _.has(after, key) && before[key] === after[key],
    build: key => ({
      type: 'unchanged',
      value: before[key],
    }),
  },
  {
    test: key =>
      _.has(before, key) && _.has(after, key) && before[key] !== after[key],
    build: key => ({
      type: 'changed',
      value: [before[key], after[key]],
    }),
  },
];

const buildDiffAst = (before, after) => {
  const keys = _.union(_.keys(before), _.keys(after));
  const mapping = createAstMapping(before, after);

  return keys.map((key) => {
    const mapper = mapping.find(rec => rec.test(key));
    return { key, ...mapper.build(key) };
  });
};

export default buildDiffAst;
