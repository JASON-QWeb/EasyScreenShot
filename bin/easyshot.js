#!/usr/bin/env node

const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path');

const mainPath = path.join(__dirname, '..', 'main.js');
const child = spawn(electron, [mainPath], { stdio: 'inherit' });

child.on('close', (code) => {
    process.exit(code);
});
