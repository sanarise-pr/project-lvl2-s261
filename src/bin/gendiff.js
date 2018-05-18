#!/usr/bin/env node

import commander from 'commander';
import _ from 'lodash';
import { version } from '../../package.json';
import genDiff from '..';
import { renderJsonLike, renderPlainText } from '../renderers';

const outputFormats = {
  json: renderJsonLike,
  plain: renderPlainText,
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
  .option('-f, --format [type]', 'Output format', 'json')
  .version(version)
  .arguments('<firstConfig> <secondConfig>')
  .action(processAction)
  .parse(process.argv);

if (!commander.args.length) {
  commander.help();
}
