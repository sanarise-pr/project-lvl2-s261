import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  '.yml': yaml.load,
  '.yaml': yaml.load,
  '.json': JSON.parse,
  '.ini': ini.parse,
};

export default (ext) => {
  const parser = parsers[ext];
  if (!parser) {
    throw new Error(`Unknown format: "${ext}"`);
  }
  return parser;
};
