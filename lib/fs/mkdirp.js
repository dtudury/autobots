"use strict";

const path = require("path");
const mkdir = require("./mkdir");

let mkdirp = module.exports = subpath => {
    if (subpath === '.' || subpath === "/") return Promise.resolve();
    return mkdirp(path.dirname(subpath))
    .then(() => mkdir(subpath))
    .catch(err => {
        if (err.code !== "EEXIST") {
            console.error(err);
            throw new Error("unhandled mkdirp error")
        }
    });
};
