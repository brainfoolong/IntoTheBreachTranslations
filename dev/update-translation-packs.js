'use strict'
module.exports = function () {

  const fs = require('fs')
  const shared = require(__dirname + '/shared')
  const iconv = require('iconv-lite')
  const zip = require('node-zip')

  let gameFiles = {}
  let filesChanged = {}

  function loadGameFileSrc (file) {
    if (typeof gameFiles[file] === 'undefined') {
      gameFiles[file] = fs.readFileSync(shared.config.gamesrc + '/' + file).toString()
    }
    return gameFiles[file]
  }

  const langDir = __dirname + '/../languages'
  const templateFileData = JSON.parse(fs.readFileSync(langDir + '/template.json').toString())
  const languageFiles = fs.readdirSync(langDir)
  const luaFiles = shared.getLuaFiles(shared.config.gamesrc)

  languageFiles.forEach(function (file) {
    const fileSplit = file.split('.')
    if (fileSplit[1] !== 'json' || file === 'template.json') {
      return
    }
    gameFiles = {}
    filesChanged = {}
    const language = fileSplit[0]
    const languageFileData = JSON.parse(fs.readFileSync(langDir + '/' + file).toString())
    for (let id in languageFileData) {
      const languageData = languageFileData[id]
      const templateData = templateFileData[id]
      if (!templateData) continue
      // convert specific files
      if (templateData.files) {
        templateData.files.forEach(function (file) {
          let search = templateData.text
          let replace = languageData.text
          let fileData = loadGameFileSrc(file)
          // csv files have another escape char than the lua files
          if (file.substr(-4) === '.csv') {
            search = search.replace(/\"/g, '""')
            replace = replace.replace(/\"/g, '""')
          } else {
            search = shared.sanitizeForRegex(search)
            replace = shared.sanitizeForRegex(replace)
          }
          // check if we have no quote enabled
          if (templateData.data && typeof templateData.data.quote !== 'undefined' && !templateData.data.quote) {
            gameFiles[file] = fileData.replace(new RegExp(shared.escapeRegex(search), 'g'), replace)
          }
          search = '"' + shared.escapeRegex(search) + '"'
          replace = '"' + replace + '"'
          gameFiles[file] = fileData.replace(new RegExp(search, 'g'), replace)
          filesChanged[file] = true
        })
      }
    }
    // go through all files via manual contexts
    luaFiles.forEach(function (fileAbsolute) {
      const file = fileAbsolute.substr(shared.config.gamesrc.length + 1)
      let fileData = loadGameFileSrc(file)
      for (let id in languageFileData) {
        const templateData = templateFileData[id]
        if (!templateData || !templateData.contexts) continue
        const languageData = languageFileData[id]
        templateData.contexts.forEach(function (context) {
          if (context.mode !== 'manual') {
            return
          }
          let regexFull = context.regex.replace(/%s/, shared.sanitizeForRegex(templateData.text, true))
          let regexText = shared.sanitizeForRegex(templateData.text, true)
          let replaceText = languageData.text
          if (context.replace) {
            context.replace.forEach(function (str, i) {
              regexFull = regexFull.replace(new RegExp('%%' + i), '(' + str + ')')
              regexText = regexText.replace(new RegExp('%%' + i), '(' + str + ')')
              replaceText = replaceText.replace(new RegExp('%%' + i), '$' + (i + 1))
            })
          }
          regexFull = new RegExp(regexFull, 'g')
          let match = null
          do {
            match = regexFull.exec(fileData)
            if (match) {
              let a = match[0]
              let b = match[0].replace(new RegExp(regexText), shared.sanitizeForRegex(replaceText))
              fileData = fileData.replace(a, b)
              filesChanged[file] = true
            }
          }
          while (match)
        })
      }
      if (typeof filesChanged[file] !== 'undefined') {
        gameFiles[file] = fileData
      }
    })
    // create new game files
    const zipArchive = new zip()
    for (let file in filesChanged) {
      let fileData = gameFiles[file]
      fileData = iconv.encode(new Buffer(fileData), 'latin1')
      zipArchive.file(file, fileData)
      // also save into gamedir if set
      if (shared.config.langInGameDir && shared.config.langInGameDir === language) {
        fs.writeFileSync(shared.config.gamedir + '/' + file, fileData)
      }
    }
    // store zip into packages folder
    fs.writeFileSync(__dirname + '/../packages/' + language + '.zip', zipArchive.generate({
      base64: false,
      compression: 'DEFLATE'
    }), 'binary')
  })
}
module.exports()