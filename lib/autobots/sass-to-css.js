"use strict";
const sass = require("node-sass");
const lib = require("../");

module.exports = config => new Promise((resolve, reject) => sass.render({
        file: config.src,
        outFile: config.dest,
        sourceMap: config.dest + ".map"
    }, (err, result) => err ? reject(err) : resolve(result)))
    .then(result => Promise.all([
            lib.fs.writeFile(config.dest, result.css),
            lib.fs.writeFile(config.dest + ".map", result.map)
        ])
        .then(() => config.includedFiles = result.stats.includedFiles)
    )
    .then(() => config)
