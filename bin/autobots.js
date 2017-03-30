#!/usr/bin/env node

"use strict";

const process = require("process");
const path = require("path");
const lib = require("../lib");

console.log(process.cwd())

const built_in_transformers = {
    "autobots_copy": lib.autobots["copy"],
    "autobots_tsx-to-js": lib.autobots["tsx-to-js"],
    "autobots_sass-to-css": lib.autobots["sass-to-css"]
}

let cwd = process.cwd();

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

load_config()
    .then(JSON.parse)
    .then(autobots => autobots.forEach(autobot => {
        autobot.src = path.join(cwd, autobot.src);
        autobot.dest = path.join(cwd, autobot.dest);
        let transformer;
        if (!(transformer = built_in_transformers[autobot.transformer])) {
            transformer = require(path.join(cwd, "node_modules", autobot.transformer));
        }
        lib.fs.mkdirp(path.dirname(autobot.dest))
            .then(() => transformer(autobot))
            .then(towatch => console.log(
                "watch:", towatch
            ))
    }))
    .catch(err => {
        console.error(err);
        throw new Error("error loading config");
    });
