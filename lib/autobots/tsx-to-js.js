"use strict";

const rollup = require("rollup");
const typescript = require("rollup-plugin-typescript");

module.exports = config => rollup.rollup({
        entry: config.src,
        plugins: [
            typescript({
                typescript: require("typescript"),
                jsx: "react",
                reactNamespace: "h",
                target: "es5"
            })
        ],
        cache: config.cache
    })
    .then(bundle => {
        config.cache = bundle;
        bundle.write({
            dest: config.dest,
            format: "es",
            sourceMap: true
        })
        config.includedFiles = bundle.modules.map(module => module.id)
        return config;
    });
