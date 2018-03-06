'use strict'

const fs = require('fs')
const iconv = require('iconv-lite')
const shared = require(__dirname + '/shared')
const langDir = __dirname + '/../languages'
const languages = fs.readdirSync(langDir)

// get all translatable game files
const gameFiles = {}
shared.translationFiles.forEach(function (file) {
  gameFiles[file] = fs.readFileSync(shared.config.gamesrc + '/' + file).toString()
})

// for each .po translation file do create packages
languages.forEach(function (langFile) {
  // only want that .po files
  if (langFile.substr(langFile.length - 2) !== 'po') {
    return
  }
  const language = langFile.substring(0, langFile.length - 3)
  const values = {}
  const lines = fs.readFileSync(langDir + '/' + langFile).toString().split('\n')
  let poFileData = shared.parsePoFile(lines, true)
  for (let poId in poFileData) {
    const poData = poFileData[poId]
    poData.msgctxt.split(',').forEach(function (msgctxt) {
      let match = msgctxt.match(/(.*?\.lua)_(.*)/i)
      const file = match[1]
      if (file === 'scripts/text.lua' || file === 'scripts/text_achievements.lua' || file === 'scripts/text_weapons.lua') {
        if (typeof values[file] === 'undefined') {
          values[file] = {}
        }
        values[file][match[2]] = poData.msgstr.length ? poData.msgstr : poData.msgid
      }
      if (file === 'scripts/text_tooltips.lua') {
        match = msgctxt.match(/(.*?\.lua)_(.*?)__(.*)_([0-9]+)/i)
        if (typeof values[file] === 'undefined') {
          values[file] = {}
        }
        if (typeof values[file][match[2]] === 'undefined') {
          values[file][match[2]] = {}
        }
        if (typeof values[file][match[2]][match[3]] === 'undefined') {
          values[file][match[2]][match[3]] = {}
        }
        values[file][match[2]][match[3]][match[4]] = poData.msgstr.length ? poData.msgstr : poData.msgid
      }
      if (file === 'scripts/text_population.lua') {
        match = msgctxt.match(/(.*?\.lua)_(.*)_([0-9]+)/i)
        if (typeof values[file] === 'undefined') {
          values[file] = {}
        }
        if (typeof values[file][match[2]] === 'undefined') {
          values[file][match[2]] = {}
        }
        values[file][match[2]][match[3]] = poData.msgstr.length ? poData.msgstr : poData.msgid
      }
    })
  }
  // goto each grouped translated value and pack it into the correct game file line
  for (let file in values) {
    const data = gameFiles[file]
    const dataLines = data.split('\n')
    const valuesRow = values[file]
    let context = null
    let newContext = null
    dataLines.forEach(function (line, lineNr) {
      const lineTrimmed = line.trim()
      line = line.replace(/\r+$/g, '')
      dataLines[lineNr] = line
      newContext = shared.getLineContext(lineTrimmed, context)
      let isInvalid = context === null || newContext === null
      context = newContext
      if (isInvalid) {
        return
      }
      for (let rowKey in valuesRow) {
        if (!valuesRow.hasOwnProperty(rowKey)) {
          continue
        }
        let rowKeyUnique = rowKey + ' = '
        if (file === 'scripts/text.lua' || file === 'scripts/text_achievements.lua' || file === 'scripts/text_weapons.lua') {
          if (lineTrimmed.substr(0, rowKeyUnique.length) === rowKeyUnique) {
            line = '    ' + rowKey + ' = "' + valuesRow[rowKey] + '",'
          }
        }
        if (file === 'scripts/text_tooltips.lua') {
          if (context === rowKey) {
            for (let id in valuesRow[rowKey]) {
              if (!valuesRow[rowKey].hasOwnProperty(id)) {
                continue
              }
              let idUnique = id + ' = '
              if (lineTrimmed.substr(0, idUnique.length) === idUnique) {
                let v = []
                for (let i in valuesRow[rowKey][id]) {
                  v.push('"' + valuesRow[rowKey][id][i] + '"')
                }
                v = v.join(', ')
                if (rowKey === 'PilotSkills') {
                  line = '    ' + id + ' = PilotSkill(' + v + '),'
                } else {
                  line = '    ' + id + ' = {' + v + '},'
                }
              }
            }
          }
        }
        if (file === 'scripts/text_population.lua') {
          if (context === 'PopEvent' && lineTrimmed.substr(0, rowKeyUnique.length) === rowKeyUnique) {
            let v = []
            let odds = lineTrimmed.match(/(,\s*[a-z]+\s*=\s*[0-9.]+\s*)\}/i)
            for (let id in valuesRow[rowKey]) {
              if (!valuesRow[rowKey].hasOwnProperty(id)) {
                continue
              }
              v.push('"' + valuesRow[rowKey][id] + '"')
            }
            v = v.join(', ')
            line = '    ' + rowKey + ' = {' + v + (odds ? odds[1] : '') + '},'
          }
        }
      }
      line = line.replace(/\{EMPTY\}/g, '')
      dataLines[lineNr] = line
    })
    gameFiles[file] = dataLines.join('\r\n')
  }
  // create new game files
  const zip = new require('node-zip')()
  for (let file in gameFiles) {
    let fileData = gameFiles[file]
    fileData = iconv.encode(new Buffer(fileData), 'latin1')
    zip.file(file, fileData)
    // also save into gamedir if set
    if (shared.config.langInGameDir && shared.config.langInGameDir === language) {
      fs.writeFileSync(shared.config.gamedir + '/' + file, fileData)
    }
  }
  // store zip into packages folder
  fs.writeFileSync(__dirname + '/../packages/' + language + '.zip', zip.generate({
    base64: false,
    compression: 'DEFLATE'
  }), 'binary')
})

