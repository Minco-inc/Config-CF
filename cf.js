#!/bin/env node
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const Config = require("./Config");

const targetRegex = />.+/;
const sectionRegex = /\[.+\]/;
const optionRegex = /.+=.+/;

const red = '\u001b[31m';
const green = '\u001b[32m';
const magenta = '\u001b[35m'
const cyan = '\u001b[36m';
const reset = '\u001b[0m';

const log = `${cyan}[Config]${reset}`;
const err = `${red}[Error]${reset}`;

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let cwd = process.cwd();
let {argv} = process;
argv.splice(0, 2);
let cffPath = argv[0];

if (argv.length !== 1) {
    error('Usage: cf <file>');
}

if (!fs.existsSync(cffPath)) {
    error('No such file or directory.');
}

let cffData = fs.readFileSync(cffPath, 'utf-8');
let lines = cffData.split('\n');
let target = lines.splice(0, 1)[0];
cffData = lines.join('\n');

if (target.match(targetRegex)[0] !== target) {
    error('Invalid config target in form.');
} else {
    target = target.substring(1, target.length);
}

let cff = Config.parse(cffData);
let configData = {};

(async () => {
    if (fs.existsSync(target)) {
        let a = await ask(`${log} Target exists. Do you want to override? [Y/n] `);
        if (a.toLowerCase().trim() !== 'y') {
            process.exit(1);
        }
    }
    for (var name in cff) {
        var section = cff[name];
        configData[name] = {};
        for (var option in section) {
            var qText = section[option];
            let casedName = [...name];
            casedName[0] = casedName[0].toUpperCase();
            casedName = casedName.join('');
            var q = `${green}[${casedName}]${reset} ${qText} `;
            await (async function reAsk() {
                var a = await ask(q);
                if (a.trim()) {
                    configData[name][option] = a;
                } else {
                    error('Please enter the valid text.', false);
                    return reAsk();
                }
                return;
            })();
        }
    }
    let config = Config.stringify(configData);
    fs.writeFileSync(target, config);
    console.log(log, 'Successfully configured.');
    process.exit(0);
})();

function ask(q) {
    return new Promise(async (resolve, reject) => {
        rl.question(q, resolve);
    });
}

function error(msg, exit = true, code = 1) {
    console.error(err, msg);
    if (exit) process.exit(code);
}
