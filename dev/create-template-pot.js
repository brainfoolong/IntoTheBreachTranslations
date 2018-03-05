'use strict'

var fs = require('fs')

var config = require(__dirname + '/config')
var manifest = require(__dirname + '/manifest')

var valuesById = {}
manifest.translationFiles.forEach(function (translationFile) {
  var filedata = fs.readFileSync(config.gamedir + '/' + translationFile).toString()
  var lines = filedata.split('\n')
  var translationLines = []
  var lineValid = false
  lines.forEach(function (line) {
    line = line.trim()
    if (line.substr(0, 2) === '--' || line.length === 0) {
      return true
    }
    if (translationFile === 'scripts/text.lua') {
      if (line === 'local Global_Texts = {') {
        lineValid = true
        return true
      }
    }
    if (translationFile === 'scripts/text_achievements.lua') {
      if (line === 'Achievement_Texts = {') {
        lineValid = true
        return true
      }
    }
    if (translationFile === 'scripts/text_tooltips.lua') {
      if (line === 'TILE_TOOLTIPS = {' || line === 'local STATUS_TOOLTIPS = {' || line === 'local PilotSkills = {') {
        lineValid = true
      }
    }
    if (translationFile === 'scripts/text_population.lua') {
      if (line === 'local PopEvent = {') {
        lineValid = true
        return true
      }
    }
    if (line === '}') {
      lineValid = false
    }
    if (lineValid) {
      translationLines.push(line)
    }
  })
  var values = {}
  var ctx = null
  translationLines.forEach(function (line) {
    if (translationFile === 'scripts/text.lua' || translationFile === 'scripts/text_achievements.lua') {
      var m = line.match(/^(.*?) = "(.*?)",($|[\s]*--)/i)
      values[m[1]] = m[2]
    }
    if (translationFile === 'scripts/text_tooltips.lua') {
      if (line === 'TILE_TOOLTIPS = {') {
        ctx = 'TILE_TOOLTIPS'
        return true
      }
      if (line === 'local STATUS_TOOLTIPS = {') {
        ctx = 'STATUS_TOOLTIPS'
        return true
      }
      if (line === 'local PilotSkills = {') {
        ctx = 'PilotSkills'
        return true
      }
      if (line === '}') {
        ctx = null
      }
      if (ctx !== null) {
        if (ctx === 'PilotSkills') {
          var m = line.match(/^(.*?) = PilotSkill\((.*?)\),/i)
          var o = JSON.parse('[' + m[2] + ']')
          for (var i in o) {
            values[ctx + '__' + m[1] + '_' + i] = o[i]
          }
        } else {
          var m = line.match(/^(.*?) = \{(.*?)\},($|[\s]*--)/i)
          var o = JSON.parse('[' + m[2].replace(/[\s,]*$/ig, '') + ']')
          for (var i in o) {
            values[ctx + '__' + m[1] + '_' + i] = o[i]
          }
        }
      }
    }
    if (translationFile === 'scripts/text_population.lua') {
      line = line.replace(/, Odds = [0-9]+ /ig, '')
      var m = line.match(/^(.*?) = \{(.*?)\},($|[\s]*--)/i)
      var o = JSON.parse('[' + m[2].replace(/[\s,]*$/ig, '') + ']')
      for (var i in o) {
        values[m[1] + '_' + i] = o[i]
      }
    }
  })
  for (var k in values) {
    var v = values[k]
    if (v === '') {
      v = '{EMPTY}'
    }
    if (typeof valuesById[v] === 'undefined') {
      valuesById[v] = []
    }
    valuesById[v].push(translationFile + '_' + k)
  }
})
var text = ['msgid ""', 'msgstr ""']
for (var msgid in valuesById) {
  text.push('msgctxt "' + valuesById[msgid].join(',') + '"')
  msgid = msgid.replace(/\n/g, '\\n')
  text.push('msgid "' + msgid + '"')
  text.push('msgstr "' + msgid + '"')
}
fs.writeFileSync( __dirname + '/../languages/template.pot', text.join('\n'))
