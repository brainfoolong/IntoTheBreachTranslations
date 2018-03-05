'use strict'

var fs = require('fs')
var iconv = require('iconv-lite')

var config = require(__dirname + '/config')
var manifest = require(__dirname + '/manifest')

var langDir = __dirname + '/../languages'
var languages = fs.readdirSync(langDir)

var templateFileData = {}
manifest.translationFiles.forEach(function (file) {
  templateFileData[file] = fs.readFileSync(config.gamedir + '/' + file).toString()
})

languages.forEach(function (langFile) {
  if (langFile.substr(langFile.length - 2) === 'po') {
    var language = langFile.substring(0, langFile.length - 3)
    var valuesToReplace = {}
    var fileData = fs.readFileSync(langDir + '/' + langFile).toString()
    var lines = fileData.split('\n')
    var currentId = null
    var msgData = {}
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
        msgData.msgctxt.join('').split(',').forEach(function (ctx) {
          var m = ctx.match(/(.*?\.lua)_(.*)/i)
          var file = m[1]
          if (file === 'scripts/text.lua' || file === 'scripts/text_achievements.lua') {
            if (typeof valuesToReplace[file] === 'undefined') {
              valuesToReplace[file] = {}
            }
            valuesToReplace[file][m[2]] = msgData.msgstr.join('')
          }
          if (file === 'scripts/text_tooltips.lua') {
            m = ctx.match(/(.*?\.lua)_(.*?)__(.*)_([0-9]+)/i)
            if (typeof valuesToReplace[file] === 'undefined') {
              valuesToReplace[file] = {}
            }
            if (typeof valuesToReplace[file][m[2]] === 'undefined') {
              valuesToReplace[file][m[2]] = {}
            }
            if (typeof valuesToReplace[file][m[2]][m[3]] === 'undefined') {
              valuesToReplace[file][m[2]][m[3]] = {}
            }
            valuesToReplace[file][m[2]][m[3]][m[4]] = msgData.msgstr.join('')
          }
          if (file === 'scripts/text_population.lua') {
            m = ctx.match(/(.*?\.lua)_(.*)_([0-9]+)/i)
            if (typeof valuesToReplace[file] === 'undefined') {
              valuesToReplace[file] = {}
            }
            if (typeof valuesToReplace[file][m[2]] === 'undefined') {
              valuesToReplace[file][m[2]] = {}
            }
            valuesToReplace[file][m[2]][m[3]] = msgData.msgstr.join('')
          }
        })
      }
    })
    for (var file in valuesToReplace) {
      var data = templateFileData[file]
      var dataLines = data.split('\n')
      var valuesFile = valuesToReplace[file]
      var ctx = null
      for (var lineNr in dataLines) {
        var line = dataLines[lineNr]
        var lineTrimmed = line.trim()
        if (lineTrimmed === 'TILE_TOOLTIPS = {') {
          ctx = 'TILE_TOOLTIPS'
          continue
        }
        if (lineTrimmed === 'local STATUS_TOOLTIPS = {') {
          ctx = 'STATUS_TOOLTIPS'
          continue
        }
        if (lineTrimmed === 'local PilotSkills = {') {
          ctx = 'PilotSkills'
          continue
        }
        if (lineTrimmed === 'local PopEvent = {') {
          ctx = 'PopEvent'
          continue
        }
        if (lineTrimmed === '}') {
          ctx = null
        }
        for (var key in valuesFile) {
          if (file === 'scripts/text.lua' || file === 'scripts/text_achievements.lua') {
            if (lineTrimmed.substr(0, key.length) === key) {
              line = '    ' + key + ' = "' + valuesFile[key] + '",'
            }
          }
          if (file === 'scripts/text_tooltips.lua') {
            if (ctx === key) {
              for (var id in valuesFile[key]) {
                if (lineTrimmed.substr(0, id.length) === id) {
                  var v = []
                  for (var i in valuesFile[key][id]) {
                    v.push('"' + valuesFile[key][id][i] + '"')
                  }
                  v = v.join(', ')
                  if (key === 'PilotSkills') {
                    line = '    ' + id + ' = PilotSkill(' + v + '),'
                  } else {
                    line = '    ' + id + ' = {' + v + '},'
                  }
                }
              }
            }
          }
          if (file === 'scripts/text_population.lua') {
            if (ctx === 'PopEvent' && lineTrimmed.substr(0, key.length) === key) {
              var v = []
              for (var i in valuesFile[key]) {
                v.push('"' + valuesFile[key][i] + '"')
              }
              v = v.join(', ')
              line = '    ' + key + ' = {' + v + '},'
            }
          }
        }
        line = line.replace(/\{DOLLAR\}/g, '\$')
        line = line.replace(/\{EMPTY\}/g, '')
        dataLines[lineNr] = line.replace(/\s+$/g, '')
      }
      templateFileData[file] = dataLines.join('\r\n')
    }
    var zip = new require('node-zip')()
    for (var file in templateFileData) {
      var fileData = templateFileData[file]
      fileData = fileData.replace(/\t/g, '    ')
      fileData = iconv.encode(new Buffer(fileData), 'latin1')
      zip.file(file, fileData)
      // also save into gamedir if set
      if (config.langInGameDir && config.langInGameDir === language) {
        // make a backup if not yet exist
        if (!fs.existsSync(config.gamedir + '/' + file + '.bkp')) {
          fs.copyFileSync(config.gamedir + '/' + file, config.gamedir + '/' + file + '.bkp')
        }
        fs.writeFileSync(config.gamedir + '/' + file, fileData)
      }
    }
    fs.writeFileSync(__dirname + '/../packages/' + language + '.zip', zip.generate({
      base64: false,
      compression: 'DEFLATE'
    }), 'binary')
  }
})

