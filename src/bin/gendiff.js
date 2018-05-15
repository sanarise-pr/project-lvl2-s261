#!/usr/bin/env node

import commander from 'commander';
import { version } from '../../package.json';
import genDiff from '..';

const processAction = (firstConfig, secondConfig) => {
  console.log(genDiff(firstConfig, secondConfig));
};

commander
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .version(version)
  .arguments('<firstConfig> <secondConfig>')
  .action(processAction)
  .parse(process.argv);

if (!commander.args.length) {
  commander.help();
}
