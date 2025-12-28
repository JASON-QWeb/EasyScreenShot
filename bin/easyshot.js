#!/usr/bin/env node

const { program } = require('commander');
const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path');
const fs = require('fs');

program
    .name('easyshot')
    .description('EasyScreenShot CLI Tool')
    .version('1.0.0', '-v, --version', 'output the version number')
    .option('-w, --watch', 'Watch mode: Consistent capture (Do not exit after capture)', false)
    .option('-o, --output <dir>', 'Output directory for screenshots', '');

program.parse(process.argv);

const options = program.opts();

// If --watch is set, it overrides --once (implicit)
let isWatch = options.watch;

const mainPath = path.join(__dirname, '..', 'main.js');

// Pass arguments to Electron
// We pass them as standard args that Electron main process can read via process.argv
// We add a delimiter '--' to separate electron args from app args if needed, but simple append works usually.
const appArgs = [];
if (isWatch) appArgs.push('--watch');
if (options.output) {
    // Resolve absolute path
    const absPath = path.resolve(process.cwd(), options.output);
    if (!fs.existsSync(absPath)) {
        console.error(`Error: Output directory does not exist: ${absPath}`);
        process.exit(1);
    }
    appArgs.push('--output', absPath);
}

const child = spawn(electron, [mainPath, ...appArgs], { stdio: 'inherit' });

child.on('close', (code) => {
    process.exit(code);
});
