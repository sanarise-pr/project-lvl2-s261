import _ from 'lodash';

const spacer = '  ';
const makeIndent = level => spacer.repeat(level * 2);
const makeMarkedIndent = (level, mark) => `${spacer.repeat((level * 2) - 1)}${mark} `;

const stringifyValue = (value, key, deepness, mark) => {
  const indent = mark ? makeMarkedIndent(deepness, mark) : makeIndent(deepness);
  if (!_.isPlainObject(value)) {
    return `${indent}${key}: ${value}`;
  }

  const keys = _.keys(value);
  if (keys.length === 0) {
    return `${indent}${key}: {}`;
  }

  const nestedStrings = keys.map(k => stringifyValue(value[k], k, deepness + 1));
  return [`${indent}${key}: {`, nestedStrings.join('\n'), `${makeIndent(deepness)}}`].join('\n');
};

const reportMapping = {
  added: ({ key, value }, deepness) => stringifyValue(value, key, deepness, '+'),
  removed: ({ key, value }, deepness) => stringifyValue(value, key, deepness, '-'),
  unchanged: ({ key, value }, deepness) => stringifyValue(value, key, deepness),
  changed: ({ key, oldValue, newValue }, deepness) =>
    [stringifyValue(oldValue, key, deepness, '-'), stringifyValue(newValue, key, deepness, '+')],
  nested: ({ key, children }, deepness, stringifyAst) => {
    const indent = makeIndent(deepness);
    return [`${indent}${key}: {`, stringifyAst(children, deepness + 1), `${indent}}`];
  },
};

const buildReport = (ast) => {
  const stringifyAst = (tree, deepness) => {
    const strings = tree.map(node => reportMapping[node.type](node, deepness, stringifyAst));
    return _.flatten(strings).join('\n');
  };
  return ['{', stringifyAst(ast, 1), '}'].join('\n');
};

export default buildReport;
