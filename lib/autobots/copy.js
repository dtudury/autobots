"use strict";

const lib = require("..");

module.exports = config => lib.fs.copyFile(config.src, config.dest)
    .then(() => config);
