"use strict";

const path = require("path");
const process = require("process");
const lib = require("./index")

const cwd = process.cwd();
const mode = process.argv[2];

const built_in_transformers = {
    "autobots_copy": lib.autobots["copy"],
    "autobots_tsx-to-js": lib.autobots["tsx-to-js"],
    "autobots_sass-to-css": lib.autobots["sass-to-css"]
}

process.on('message', autobot => {
    let transformer;
    if (!(transformer = built_in_transformers[autobot.transformer])) {
        transformer = require(path.join(cwd, "node_modules", autobot.transformer));
    }
    Promise.resolve()
        .then(lib.build.watch(lib.build.time(autobot.label, () => transformer(autobot))))
});
