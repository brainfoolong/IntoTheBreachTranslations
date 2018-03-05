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
  if (langFile.substr(langFile.length - 2) !== 'po') {
    return
  }
  const language = langFile.substring(0, langFile.length - 3)
  const values = {}
  const lines = fs.readFileSync(langDir + '/' + langFile).toString().split('\n')
  let currentId = null
  let msgData = {}
  // first, group each translation to correct gamefile and translation key
  lines.forEach(function (line) {
    line = line.trim()
    if (line.substr(0, 7) === 'msgctxt') {
      currentId = 'msgctxt'
      line = line.substr(8)
      msgData = {}
    }
    if (line.substr(0, 5) === 'msgid') {
      currentId = null
    }
    if (line.substr(0, 6) === 'msgstr') {
      currentId = 'msgstr'
      line = line.substr(7)
    }
    if (line.substr(0, 1) === '"' && currentId !== null) {
      if (typeof msgData[currentId] === 'undefined') {
        msgData[currentId] = []
      }
      msgData[currentId].push(line.substring(1, line.length - 1))
    }
    if (currentId !== null && msgData.msgctxt && msgData.msgstr) {
      msgData.msgctxt.join('').split(',').forEach(function (msgctxt) {
        let match = msgctxt.match(/(.*?\.lua)_(.*)/i)
        const file = match[1]
        if (file === 'scripts/text.lua' || file === 'scripts/text_achievements.lua') {
          if (typeof values[file] === 'undefined') {
            values[file] = {}
          }
          values[file][match[2]] = msgData.msgstr.join('')
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
          values[file][match[2]][match[3]][match[4]] = msgData.msgstr.join('')
        }
        if (file === 'scripts/text_population.lua') {
          match = msgctxt.match(/(.*?\.lua)_(.*)_([0-9]+)/i)
          if (typeof values[file] === 'undefined') {
            values[file] = {}
          }
          if (typeof values[file][match[2]] === 'undefined') {
            values[file][match[2]] = {}
          }
          values[file][match[2]][match[3]] = msgData.msgstr.join('')
        }
      })
    }
  })
  // goto each grouped translated value and pack it into the correct game file line
  for (let file in values) {
    const data = gameFiles[file]
    const dataLines = data.split('\n')
    const valuesRow = values[file]
    let context = null
    let newContext = null
    dataLines.forEach(function (line, lineNr) {
      const lineTrimmed = line.trim()
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
        if (file === 'scripts/text.lua' || file === 'scripts/text_achievements.lua' || file === 'scripts/text_weapons.lua') {
          if (lineTrimmed.substr(0, rowKey.length) === rowKey) {
            line = '    ' + rowKey + ' = "' + valuesRow[rowKey] + '",'
          }
        }
        // @todo fix Odds=[0-9]
        if (file === 'scripts/text_tooltips.lua') {
          if (context === rowKey) {
            for (let id in valuesRow[rowKey]) {
              if (!valuesRow[rowKey].hasOwnProperty(id)) {
                continue
              }
              if (lineTrimmed.substr(0, id.length) === id) {
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
          if (context === 'PopEvent' && lineTrimmed.substr(0, rowKey.length) === rowKey) {
            let v = []
            for (let id in valuesRow[rowKey]) {
              if (!valuesRow[rowKey].hasOwnProperty(id)) {
                continue
              }
              v.push('"' + valuesRow[rowKey][id] + '"')
            }
            v = v.join(', ')
            line = '    ' + rowKey + ' = {' + v + '},'
          }
        }
      }
      line = line.replace(/\{EMPTY\}/g, '')
      dataLines[lineNr] = line.replace(/\s+$/g, '')
    })
    gameFiles[file] = dataLines.join('\r\n')
  }
  // create new game files
  const zip = new require('node-zip')()
  for (let file in gameFiles) {
    let fileData = gameFiles[file]
    fileData = fileData.replace(/\t/g, '    ')
    fileData = iconv.encode(new Buffer(fileData), 'latin1')
    zip.file(file, fileData)
    // also save into gamedir if set
    if (shared.config.langInGameDir && shared.config.langInGameDir === language) {
      // make a backup of original files if not yet exist
      if (!fs.existsSync(shared.config.gamedir + '/' + file + '.bkp')) {
        fs.copyFileSync(shared.config.gamedir + '/' + file, shared.config.gamedir + '/' + file + '.bkp')
      }
      fs.writeFileSync(shared.config.gamedir + '/' + file, fileData)
    }
  }
  // store zip into packages folder
  fs.writeFileSync(__dirname + '/../packages/' + language + '.zip', zip.generate({
    base64: false,
    compression: 'DEFLATE'
  }), 'binary')
})

