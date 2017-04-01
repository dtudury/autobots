#!/usr/bin/env node

"use strict";

const process = require("process");
const child_process = require("child_process");
const path = require("path");
const lib = require("../lib");

let cwd = process.cwd();

const load_config = () => lib.fs.readFile(path.join(cwd, ".autobots.json"), "utf8")
    .catch(err => {
        let parent = path.dirname(cwd);
        if (err.code === "ENOENT" && parent !== cwd) {
            cwd = parent;
            return load_config();
        }
        console.error(err);
        throw new Error(`unhandled error code: ${err.code} in load_config`);
    })

load_config()
    .then(JSON.parse)
    .then(autobots => {
        let longest_label = 0;
        autobots.forEach(autobot => {
            autobot.src = path.join(cwd, autobot.src);
            autobot.dest = path.join(cwd, autobot.dest);
            autobot.label = autobot.label || `${autobot.dest} (${autobot.transformer})`;
            longest_label = Math.max(longest_label, autobot.label.length)
        })
        Promise.all(autobots.map(autobot => lib.fs.mkdirp(path.dirname(autobot.dest))))
        .then(() => {
            autobots.forEach(autobot => {
                while (autobot.label.length < longest_label) autobot.label += " ";
                let child = child_process.fork(path.join(__dirname, "../lib/child.js"), process.argv.slice(2), {cwd});
                child.send(autobot);
            });
        })
    })
    .catch(err => {
        console.error(err);
        throw new Error("error loading config");
    });
