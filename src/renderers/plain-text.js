import _ from 'lodash';

const buildIntro = (key, parentPath) =>
  `Property '${parentPath}${key}' was`;

const stringifyValue = (value) => {
  if (_.isObject(value)) {
    return 'complex value';
  }
  if (_.isString(value)) {
    return `'${value}'`;
  }
  return value;
};

const mapping = {
  unchanged: () => '',
  added: ({ key, value }, parentPath) =>
    `${buildIntro(key, parentPath)} added with value: ${stringifyValue(value)}`,
  removed: ({ key }, parentPath) =>
    `${buildIntro(key, parentPath)} removed`,
  changed: ({ key, oldValue, newValue }, parentPath) =>
    `${buildIntro(key, parentPath)} updated. From ${stringifyValue(oldValue)} to ${stringifyValue(newValue)}`,
  nested: ({ key, children }, parentPath, stringifyAst) =>
    stringifyAst(children, `${parentPath}${key}.`),
};

const render = (ast) => {
  const stringifyAst = (tree, parentPath) => {
    const strings = tree
      .map(node => mapping[node.type](node, parentPath, stringifyAst))
      .filter(el => el !== '');
    return _.flatten(strings);
  };
  return stringifyAst(ast, '').join('\n');
};

export default render;