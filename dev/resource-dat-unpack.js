'use strict'
module.exports = function () {

  const fs = require('fs')
  const shared = require(__dirname + '/shared')
  const jspack = require(__dirname + '/lib/jspack')
  const extractFolder = __dirname + '/dat-files-extracted'
  let resourceDatFile = shared.config.gamesrc + '/resources/resource.dat'
  const resourceDat = fs.readFileSync(resourceDatFile)

  /**
   * Read dat file
   * @param offset
   * @param length
   * @returns {Buffer}
   */
  function read (offset, length) {
    return resourceDat.slice(offset, offset + length)
  }

  /**
   * Delete folder recursive
   * @param path
   */
  function deleteFolderRecursive (path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function (file) {
        const curPath = path + '/' + file
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath)
        } else {
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(path)
    }
  }

  const indexSize = jspack.Unpack('<L', read(0, 4))[0]
  let indexArr = new Array(indexSize)
  for (let i = 0; i < indexSize; i++) {
    let start = 4 + 4 * i
    indexArr[i] = jspack.Unpack('<L', read(start, 4))[0]
  }
  let files = new Array(indexSize)
  indexArr.forEach(function (offset, i) {
    let lfn = jspack.Unpack('<LL', read(offset, 8))
    let filename = read(offset + 8, lfn[1])
    files[i] = {
      'filename': filename.toString(),
      'offset': offset + 8 + filename.length,
      'size': lfn[0]
    }
  })

  deleteFolderRecursive(extractFolder)
  fs.mkdirSync(extractFolder)
  files.forEach(function (file, i) {
    let parts = file.filename.split('/')
    let path = extractFolder
    parts.pop()
    parts.forEach(function (part) {
      path += '/' + part
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
      }
    })
    fs.writeFileSync(extractFolder + '/' + file.filename, read(file.offset, file.size))
  })
}
module.exports()