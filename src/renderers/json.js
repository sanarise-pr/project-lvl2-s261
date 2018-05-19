import _ from 'lodash';

const makeJsonRecord = ({ key, type }, path, data) => ({
  keyPath: `${path}${key}`,
  status: type,
  ...data,
});

const mapping = {
  unchanged: () => null,
  added: (node, parentPath) =>
    makeJsonRecord(node, parentPath, { newValue: node.value }),
  removed: (node, parentPath) =>
    makeJsonRecord(node, parentPath, { oldValue: node.value }),
  changed: (node, parentPath) =>
    makeJsonRecord(node, parentPath, { newValue: node.newValue, oldValue: node.oldValue }),
  nested: ({ key, children }, parentPath, stringifyAst) =>
    stringifyAst(children, `${parentPath}${key}.`),
};

const render = (ast) => {
  const stringifyAst = (tree, parentPath) => {
    const recs = tree
      .map(node => mapping[node.type](node, parentPath, stringifyAst))
      .filter(el => el !== null);
    return _.flatten(recs);
  };
  return JSON.stringify(stringifyAst(ast, ''), null, 2);
};

export default render;
