#!/data/data/com.termux/files/usr/bin/env node

"use strict";

const process = require("process");
const child_process = require("child_process");
const path = require("path");
const lib = require("../lib");

let cwd = process.cwd();
let mode = process.argv.slice(2).join(' ');
let autobots;

console.log(mode);
console.log(mode);
console.log(mode);
//go == transform and rollout (?)
//rollout
//transform

//side-effect: fixes cwd to .json location
let load_config = () => lib.fs.readFile(path.join(cwd, ".autobots.json"), "utf8")
    .catch(err => {
        let parent = path.dirname(cwd);
        if (err.code === "ENOENT" && parent !== cwd) {
            cwd = parent;
            return load_config();
        }
        console.error(err);
        throw new Error(`unhandled error code: ${err.code} in load_config`);
    })
    
let expand_paths = () => {
    autobots.forEach(autobot => {
        autobot.src = path.join(cwd, autobot.src);
        autobot.dest = path.join(cwd, autobot.dest);
    })
    return autobots;
};

let fix_labels = () => {
    let longest_label = 0;
    autobots.forEach(autobot => {
        autobot.label = autobot.label || `${autobot.dest} (${autobot.transformer})`;
        longest_label = Math.max(longest_label, autobot.label.length)
    })
    autobots.forEach(autobot => {
        while (autobot.label.length < longest_label) autobot.label += " ";
    })
    return autobots;
};

let fork_autobots = () => {
    autobots.forEach(autobot => {
        child_process.fork(path.join(__dirname, "../lib/child.js"), process.argv.slice(2), {cwd}).send(autobot);
    });
    return autobots;
};


load_config()
    .then(config => autobots = JSON.parse(config))
    .then(fix_labels)
    .then(expand_paths)
/*
    .then(autobots => {
    	    switch(mode) {
    	        case "go":
    	            return mkdirps(autobots)
    	    }
    })
*/
    .then(() => Promise.all(autobots.map(autobot => lib.fs.mkdirp(path.dirname(autobot.dest)))))
    .then(fork_autobots)
    .catch(err => {
        console.error(err);
        throw new Error(`error running autobots ${mode}`);
    });
