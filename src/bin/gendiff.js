#!/usr/bin/env node

import program from 'commander';
import { version } from '../../package.json';

const processAction = (firstConfig, secondConfig) => {
  console.log('args:', firstConfig, secondConfig);
  console.log('opts:', program.format);
};

program
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .version(version)
  .arguments('<firstConfig> <secondConfig>')
  .action(processAction)
  .parse(process.argv);

console.log(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
