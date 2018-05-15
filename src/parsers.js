import { load } from 'js-yaml';

const parsers = {
  '.yml': load,
  '.yaml': load,
  '.json': JSON.parse,
};

export default (ext) => {
  const parser = parsers[ext];
  if (!parser) {
    throw new Error(`Unknown format: "${ext}"`);
  }
  return parser;
};
