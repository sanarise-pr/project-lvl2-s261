/* eslint no-use-before-define: ["error", { "variables": false }] */
import _ from 'lodash';

const spacer = '  ';

const stringifyValue = (value, key, prefix) => {
  if (!_.isPlainObject(value)) {
    return `${prefix}${key}: ${value}`;
  }

  const keys = _.keys(value);
  if (keys.length === 0) {
    return `${prefix}${key}: {}`;
  }

  const nestedStrings = keys.map(k => stringifyValue(value[k], k, spacer));
  return [`${prefix}${key}: {`, nestedStrings, `${spacer}}`];
};

const astToStringTree = (ast) => {
  const reportMapping = {
    added: ({ key, value }) => stringifyValue(value, key, '+ '),
    removed: ({ key, value }) => stringifyValue(value, key, '- '),
    unchanged: ({ key, value }) => stringifyValue(value, key, spacer),
    changed: ({ key, oldValue, newValue }) =>
      [].concat(stringifyValue(oldValue, key, '- '), stringifyValue(newValue, key, '+ ')),
    nested: ({ key, children }) => [`${spacer}${key}: {`, iter(children), `${spacer}}`],
  };

  const iter = tree =>
    tree.reduce((acc, node) => acc.concat(reportMapping[node.type](node)), []);

  return ['{', iter(ast), '}'];
};

const stringTreeToIndentedStrings = (stringTree) => {
  const iter = (tree, level) => tree.map((el) => {
    if (el instanceof Array) {
      return iter(el, level + 1);
    }
    const spacerCount = Math.max((level * 2) - 1, 0);
    return `${spacer.repeat(spacerCount)}${el}`;
  });

  return _.flattenDeep(iter(stringTree, 0));
};

const buildReport = (ast) => {
  const stringTree = astToStringTree(ast);
  const strings = stringTreeToIndentedStrings(stringTree);
  return strings.join('\n');
};

export default buildReport;
