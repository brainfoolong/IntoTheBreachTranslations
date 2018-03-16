'use strict'
module.exports = function () {

  const fs = require('fs')
  const jspack = require(__dirname + '/lib/jspack')
  const extractFolder = __dirname + '/dat-files-extracted'
  const modifiedFolder = __dirname + '/dat-files-modified'
  const generatedFolder = __dirname + '/dat-generated'
  const resourceDatFile = generatedFolder + '/resource.dat'
  let resourceDatNew = fs.openSync(resourceDatFile, 'w+')
  let files = []

  /**
   * Write to data file
   * @param data
   * @param offset
   * @returns {Buffer}
   */
  function write (data, offset) {
    fs.writeSync(resourceDatNew, new Buffer(data), 0, data.length, offset)
  }

  /**
   * Read directory and store the files into an array
   * @param relativePath
   */
  function readDirectory (relativePath) {
    let path = extractFolder + relativePath
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function (file) {
        const curRelativePath = relativePath + '/' + file
        const curPath = path + '/' + file
        const lstat = fs.lstatSync(curPath)
        if (lstat.isDirectory()) {
          readDirectory(curRelativePath)
        } else {
          files.push({
            'size': lstat.size,
            'filename': curRelativePath.substr(1)
          })
        }
      })
    }
  }

  /**
   * Copy all files from modified folder into extracted folder
   * @param relativePath
   */
  function copyModifiedToExtracted (relativePath) {
    let path = modifiedFolder + relativePath
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function (file) {
        const curPath = path + '/' + file
        if (fs.lstatSync(curPath).isDirectory()) {
          copyModifiedToExtracted(relativePath + '/' + file)
        } else {
          fs.copyFileSync(modifiedFolder + relativePath + '/' + file, extractFolder + relativePath + '/' + file)
        }
      })
    }
  }

  copyModifiedToExtracted('/')
  readDirectory('')

  // pack the resource dat
  write(jspack.Pack('<L', [files.length]), 0)
  let offset = 4 + 4 * files.length
  files.forEach(function (file, i) {
    file.offset = offset
    write(jspack.Pack('<L', [offset]), 4 + 4 * i)
    offset += file.size + file.filename.length + 8
  })
  files.forEach(function (file, i) {
    write(jspack.Pack('<LL', [file.size, file.filename.length]), file.offset)
    write(file.filename, file.offset + 8)
    write(fs.readFileSync(extractFolder + '/' + file.filename), file.offset + 8 + file.filename.length)
  })
}
module.exports()