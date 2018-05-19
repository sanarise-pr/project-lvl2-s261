import _ from 'lodash';

const buildJsonRecord = (node, path) => {
  const {
    key, type, oldValue, newValue,
  } = node;
  return {
    keyPath: `${path}${key}`,
    status: type,
    newValue,
    oldValue,
  };
};

const mapping = {
  unchanged: () => null,
  added: (node, parentPath) => buildJsonRecord(node, parentPath),
  removed: (node, parentPath) => buildJsonRecord(node, parentPath),
  changed: (node, parentPath) => buildJsonRecord(node, parentPath),
  nested: ({ key, children }, parentPath, mapAst) =>
    mapAst(children, `${parentPath}${key}.`),
};

const render = (ast) => {
  const mapAst = (tree, parentPath) => {
    const recs = tree
      .map(node => mapping[node.type](node, parentPath, mapAst))
      .filter(el => el !== null);
    return _.flatten(recs);
  };
  return JSON.stringify(mapAst(ast, ''));
};

export default render;
