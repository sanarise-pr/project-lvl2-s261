import fs from 'fs';
import { extname } from 'path';
import getParser from './parsers';
import buildDiffAst from './diff-ast';
import { renderJsonLike } from './renderers';

const readAndParseSync = (path) => {
  const rawData = fs.readFileSync(path, 'utf-8');
  const pathExtName = extname(path);
  const parse = getParser(pathExtName);

  return parse(rawData);
};

const genDiff = (beforePath, afterPath, render = renderJsonLike) => {
  const before = readAndParseSync(beforePath);
  const after = readAndParseSync(afterPath);
  const ast = buildDiffAst(before, after);

  return render(ast);
};

export default genDiff;
