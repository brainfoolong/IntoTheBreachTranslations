'use strict'

const fs = require('fs')
const iconv = require('iconv-lite')
const shared = require(__dirname + '/shared')
const langDir = __dirname + '/../languages'
const languages = fs.readdirSync(langDir)
const md5 = require('md5')

// get all translatable game files
const gameFilesOriginal = {}
shared.translationFiles.forEach(function (file) {
  gameFilesOriginal[file] = fs.readFileSync(shared.config.gamesrc + '/' + file).toString().replace(/\r/g, '')
})
for (let file in shared.additionalTranslationFiles) {
  gameFilesOriginal[file] = fs.readFileSync(shared.config.gamesrc + '/' + file).toString().replace(/\r/g, '')
}

// for each .po translation file do create packages
languages.forEach(function (langFile) {
  // only want that .po files
  if (langFile.substr(langFile.length - 2) !== 'po') {
    return
  }
  const gameFiles = {}
  for (let file in gameFilesOriginal) {
    gameFiles[file] = gameFilesOriginal[file]
  }
  const language = langFile.substring(0, langFile.length - 3)
  const values = {}
  const translationValues = {}
  const pilotValues = {}
  const csvValues = {}
  const lines = fs.readFileSync(langDir + '/' + langFile).toString().split('\n')
  let poFileData = shared.parsePoFile(lines, true)
  for (let poId in poFileData) {
    const poData = poFileData[poId]
    poData.msgctxt.split(',').forEach(function (msgctxt) {
      let matchAdditionalFile = msgctxt.match(/(.*?\.lua)\#([0-9]+)/i)
      let matchAdditionalKey = msgctxt.match(/^\#([0-9]+)/i)
      let matchAdditionalPilots = msgctxt.match(/^\#pilots([0-9]+)/i)
      let matchAdditionalCsv = msgctxt.match(/^\~(.*?\.csv)_(.*)/i)
      // handle csv translations
      let file = null
      if (matchAdditionalCsv) {
        file = matchAdditionalCsv[1]
        if (typeof csvValues[file] === 'undefined') {
          csvValues[file] = {}
        }
        csvValues[file][matchAdditionalCsv[2]] = poData.msgstr.length ? poData.msgstr : null
        return
      }
      // handle additional translations
      if (matchAdditionalKey) {
        translationValues[matchAdditionalKey[1]] = poData.msgstr.length ? poData.msgstr : null
        return
      }
      // handle additional pilots
      if (matchAdditionalPilots) {
        pilotValues[matchAdditionalPilots[1]] = poData.msgstr.length ? poData.msgstr : null
        return
      }
      // handle additional translation files
      if (matchAdditionalFile) {
        file = matchAdditionalFile[1]
        if (typeof values[file] === 'undefined') {
          values[file] = {}
        }
        values[file][matchAdditionalFile[2]] = poData.msgstr.length ? poData.msgstr : poData.msgid
        return
      }
      // the text*.lua files
      let match = msgctxt.match(/(.*?\.lua)_(.*)/i)
      file = match[1]
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
    if (typeof gameFiles[file] === 'undefined') {
      continue
    }
    const data = gameFiles[file]
    const dataLines = data.split('\n')
    const valuesRow = values[file]
    let context = null
    let newContext = null
    // handle additional translations files
    if (shared.additionalTranslationFiles) {
      if (typeof shared.additionalTranslationFiles[file] !== 'undefined') {
        let translationLines = shared.additionalTranslationFiles[file]
        for (let id in translationLines) {
          let translationData = translationLines[id]
          let text = translationData.text
          translationData.lines.forEach(function (lineNr) {
            lineNr--
            let line = dataLines[lineNr]
            let regex = new RegExp(shared.escapeRegex(text), 'g')
            if (!line.match(regex)) {
              throw 'Error - Could not find translation text \'' + text + '\' in original file \'' + file + ':' + lineNr + '\''
            }
            dataLines[lineNr] = line.replace(regex, valuesRow[id])
          })
        }
        gameFiles[file] = dataLines.join('\r\n')
        continue
      }
    }
    // the text*.lua files
    dataLines.forEach(function (line, lineNr) {
      const lineTrimmed = line.trim()
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
  // handle additional translation keys
  let luaFiles = shared.getAllOtherLuaFiles(shared.config.gamesrc, [])
  luaFiles.forEach(function (file) {
    let fileRelative = file.substr(shared.config.gamesrc.length + 1)
    let fileData = typeof gameFiles[fileRelative] !== 'undefined' ? gameFiles[fileRelative] : fs.readFileSync(file).toString()
    fileData = fileData.replace(/\r/g, '')
    let found = false
    let lines = fileData.split('\n')
    for (let id in translationValues) {
      if (typeof translationValues[id] === 'undefined' || translationValues[id] === null || !translationValues[id].length) {
        continue
      }
      let row = shared.additionalTranslations[id]
      if (!row) {
        continue
      }
      let text = row[0]
      let textEscaped = row[1].replace(/\%s/, '(' + shared.escapeRegex(text) + ')')
      let regex = new RegExp(textEscaped, 'g')
      lines.forEach(function (line, lineNr) {
        let m = line.match(regex)
        if (m) {
          m[0] = m[0].replace(new RegExp(shared.escapeRegex(text), 'g'), translationValues[id])
          lines[lineNr] = line.replace(regex, m[0])
          found = true
        }
      })
    }
    if (found) {
      gameFiles[fileRelative] = lines.join('\r\n')
    }
  })
  // handle additional csv files
  for (let file in csvValues) {
    let fileData = typeof gameFiles[file] !== 'undefined' ? gameFiles[file] : fs.readFileSync(shared.config.gamesrc + '/' + file).toString()
    fileData = fileData.replace(/\r/g, '')
    let lines = fileData.split('\n')
    lines.forEach(function (line, lineNr) {
      if (lineNr <= 2) {
        return
      }
      const re = /"(.{2,}?)"/g
      let m
      do {
        m = re.exec(line)
        if (m) {
          const v = m[1].replace(/\n/g, '').replace(/\\n/g, '').replace(/^[",]+|[",\\]+$/g, '').trim()
          if (v.length) {
            const hash = md5(v)
            if (typeof csvValues[file][hash] !== 'undefined') {
              line = line.replace(new RegExp('([^\\w])(' + shared.escapeRegex(v) + ')([^\\w])', 'g'), '$1' + csvValues[file][hash] + '$3')
              lines[lineNr] = line
            }
          }
        }
      } while (m)
      gameFiles[file] = lines.join('\r\n')
    })
  }
  // handle additional pilots
  (function () {
    let file = 'scripts/personalities/pilots.csv'
    let fileData =  fs.readFileSync(shared.config.gamesrc + '/'+file).toString()
    fileData = fileData.replace(/\r/g, '')
    shared.pilotsTranslation.forEach(function (text, key) {
      if (typeof pilotValues[key] !== 'undefined') {
        fileData = fileData.replace(new RegExp(shared.escapeRegex(text)), pilotValues[key])
      }
    })
    gameFiles[file] = fileData
  })()
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

