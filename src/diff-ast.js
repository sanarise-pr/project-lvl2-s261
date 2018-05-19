import _ from 'lodash';

const createAstMapping = (before, after) => [
  {
    test: key => !_.has(before, key) && _.has(after, key),
    build: key => ({
      type: 'added',
      key,
      newValue: after[key],
    }),
  },
  {
    test: key => _.has(before, key) && !_.has(after, key),
    build: key => ({
      type: 'removed',
      key,
      oldValue: before[key],
    }),
  },
  {
    test: key => _.isPlainObject(before[key]) && _.isPlainObject(after[key]),
    build: (key, buildDiffAst) => ({
      type: 'nested',
      key,
      children: buildDiffAst(before[key], after[key]),
    }),
  },
  {
    test: key =>
      _.has(before, key) && _.has(after, key) && before[key] === after[key],
    build: key => ({
      type: 'unchanged',
      key,
      oldValue: before[key],
      newValue: after[key],
    }),
  },
  {
    test: key =>
      _.has(before, key) && _.has(after, key) && before[key] !== after[key],
    build: key => ({
      type: 'changed',
      key,
      oldValue: before[key],
      newValue: after[key],
    }),
  },
];

const buildDiffAst = (before, after) => {
  const keys = _.union(_.keys(before), _.keys(after));
  const mapping = createAstMapping(before, after);

  return keys.map((key) => {
    const mapper = mapping.find(rec => rec.test(key));
    return mapper.build(key, buildDiffAst);
  });
};

export default buildDiffAst;
