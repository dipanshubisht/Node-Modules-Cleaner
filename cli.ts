#!/usr/bin/env node

import { cleanTopLevelNodeModules } from './clean-node-modules.js';

// Check for test mode flag
const testMode = process.argv.includes('--test');

// Get directory from command line argument or use current directory
// Filter out the --test flag if present
const args = process.argv.filter(arg => arg !== '--test');
const targetDir = args[2] || process.cwd();

cleanTopLevelNodeModules(targetDir, testMode); 