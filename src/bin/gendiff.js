#!/usr/bin/env node

import commander from 'commander';
import _ from 'lodash';
import { version } from '../../package.json';
import genDiff from '..';
import { renderTree, renderPlain, renderJson } from '../renderers';

const outputFormats = {
  tree: renderTree,
  plain: renderPlain,
  json: renderJson,
};

const processAction = (firstConfig, secondConfig) => {
  if (!_.has(outputFormats, commander.format)) {
    console.log(`Unknown output format "${commander.format}". `
      + `Available formats: ${_.keys(outputFormats).join(', ')}.`);
    return;
  }
  console.log(genDiff(firstConfig, secondConfig, outputFormats[commander.format]));
};

commander
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format', 'tree')
  .version(version)
  .arguments('<firstConfig> <secondConfig>')
  .action(processAction)
  .parse(process.argv);

if (!commander.args.length) {
  commander.help();
}
