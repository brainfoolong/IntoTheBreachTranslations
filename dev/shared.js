'use strict'
const fs = require('fs')

const shared = {
  'config': require(__dirname + '/config')
}

/**
 * Get array of lua files based on the filter
 * @param {string}dir
 * @param {string=} filter
 * @param {array=} out
 * @returns {[]}
 */
shared.getLuaFiles = function (dir, filter, out) {
  if (typeof out === 'undefined') out = []
  const files = fs.readdirSync(dir)
  files.forEach(function (file) {
    let path = dir + '/' + file
    if (fs.lstatSync(path).isDirectory()) {
      shared.getLuaFiles(path, filter, out)
    } else if (file.substr(-4) === '.lua') {
      if (filter && !path.match(new RegExp(filter))) {
        return
      }
      out.push(path)
    }
  })
  return out
}

/**
 * Escape str for use in regex
 * @param str
 * @returns {string}
 */
shared.escapeRegex = function (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}

/**
 * Sanitize string for regex use
 * @param {string} str
 * @param {bool=} escape
 * @returns {string}
 */
shared.sanitizeForRegex = function (str, escape) {
  str = str.replace(/\n/g, '\\n').replace(/"/g, '\\"')
  if(escape) str = shared.escapeRegex(str)
  return str
}

module.exports = shared