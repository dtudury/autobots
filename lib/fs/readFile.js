"use strict";

const fs = require("fs");

module.exports = (file, options = {}) => new Promise((resolve, reject) => {
    fs.readFile(file, options, (err, data) => err ? reject(err) : resolve(data));
});
