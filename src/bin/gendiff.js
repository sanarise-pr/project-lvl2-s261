#!/usr/bin/env node

import commander from 'commander';
import { version } from '../../package.json';

const processAction = (firstConfig, secondConfig) => {
  console.log('args:', firstConfig, secondConfig);
  console.log('opts:', commander.format);
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
