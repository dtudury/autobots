"use strict";

const fs = require("fs");

module.exports = promise => {
    let last_run = 0;
    let watchers = [];
    let f = () => {
        if (Date.now() - last_run < 1000) return;
        watchers.forEach(watcher => watcher.close());
        watchers = [];
        Promise.resolve()
            .then(promise)
            .then(config => {
                last_run = Date.now();
                let includedFiles = config.includedFiles || [config.src];
                includedFiles.forEach(includedFile => {
                    try {
                        let watcher = fs.watch(includedFile, f);
                        watchers.push(watcher);
                    } catch (e) {
                        //ignore
                    }
                });
            })
            .catch(console.error)
    };
    return f();
};
