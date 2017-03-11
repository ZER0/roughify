"use strict";

import * as fs from 'fs';

function promiserify(fn) {
  return (...args) => new Promise((resolve, reject) => {
    fn(...args, (err, data) => err ? reject(err) : resolve(data));
  });
}

export const access = promiserify(fs.access);
export const open = promiserify(fs.open);
export const append = promiserify(fs.appendFile);
export const unlink = promiserify(fs.unlink);

export const copy = ({from, to}) => new Promise((resolve, reject) => {
  let readStream = fs.createReadStream(from);
  let writeStream = fs.createWriteStream(to);

  readStream.on("error", reject);
  writeStream.on("error", reject);

  readStream.pipe(writeStream).on("finish", resolve);
});
