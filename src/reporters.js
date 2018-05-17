/* eslint no-use-before-define: ["error", { "variables": false }] */
import _ from 'lodash';

const spacer = '  ';

const stringifyValue = (key, value, prefix) => {
  if (!_.isPlainObject(value)) {
    return `${prefix}${key}: ${value}`;
  }

  const keys = _.keys(value);
  if (keys.length === 0) {
    return `${prefix}${key}: {}`;
  }

  const nestedStrings = keys.map(k => stringifyValue(k, value[k], spacer));
  return [`${prefix}${key}: {`, nestedStrings, `${spacer}}`];
};

const convertAst = (ast) => {
  const reportMapping = {
    added: ({ key, value }) => stringifyValue(key, value, '+ '),
    removed: ({ key, value }) => stringifyValue(key, value, '- '),
    unchanged: ({ key, value }) => stringifyValue(key, value, spacer),
    changed: ({ key, value }) =>
      [].concat(stringifyValue(key, value[0], '- '), stringifyValue(key, value[1], '+ ')),
    nested: ({ key, children }) => [`${spacer}${key}: {`, iter(children), `${spacer}}`],
  };

  const iter = subAst =>
    subAst.reduce((acc, node) => acc.concat(reportMapping[node.type](node)), []);

  const mappedAst = ['{', iter(ast), '}'];
  return mappedAst;
};

const buildReport = (ast) => {
  const stringTree = convertAst(ast);

  const iter = (tree, level) => tree.map((el) => {
    if (el instanceof Array) {
      return iter(el, level + 1);
    }
    const spacerCount = Math.max((level * 2) - 1, 0);
    return `${spacer.repeat(spacerCount)}${el}`;
  });

  return _.flattenDeep(iter(stringTree, 0)).join('\n');
};

export default buildReport;
