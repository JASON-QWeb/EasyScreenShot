#!/usr/bin/env node

const { program } = require('commander');
const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path');
const fs = require('fs');

const { loadConfig, saveConfig } = require('./config');

program
    .name('easyshot')
    .description('EasyScreenShot CLI Tool')
    .version('1.0.0', '-v, --version', 'output the version number')
    .option('-w, --watch', 'Watch mode: Consistent capture (Do not exit after capture)', false)
    .option('-o, --output <dir>', 'Set default output directory for screenshots');

program.parse(process.argv);

const options = program.opts();

// Handle -o / --output as configuration setter
if (options.output) {
    const absPath = path.resolve(process.cwd(), options.output);
    if (!fs.existsSync(absPath)) {
        console.error(`Error: Directory does not exist: ${absPath}`);
        process.exit(1);
    }

    const config = loadConfig();
    config.defaultOutput = absPath;
    saveConfig(config);

    console.log(`✅ Default output directory updated to: ${absPath}`);
    process.exit(0);
}

// Launch Application
const isWatch = options.watch;
const mainPath = path.join(__dirname, '..', 'main.js');
const appArgs = [];

if (isWatch) appArgs.push('--watch');

// Load default output from config
const config = loadConfig();
if (config.defaultOutput) {
    // Verify it still exists
    if (fs.existsSync(config.defaultOutput)) {
        appArgs.push('--output', config.defaultOutput);
    } else {
        console.warn(`⚠️ Configured output directory not found (${config.defaultOutput}). Using default (Desktop).`);
    }
}

const child = spawn(electron, [mainPath, ...appArgs], { stdio: 'inherit' });

child.on('close', (code) => {
    process.exit(code);
});
