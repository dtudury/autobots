"use strict";

const fs = require("fs");

module.exports = (src, dest) => new Promise((resolve, reject) => {
    let read_stream = fs.createReadStream(src);
    read_stream.on("error", reject);
    let write_stream = fs.createWriteStream(dest);
    write_stream.on("error", err => {
        console.error(err);
        throw new Error("unhandled write stream error");
    });
    write_stream.on("close", () => resolve([src]));
    read_stream.pipe(write_stream);
});
