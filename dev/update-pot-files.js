'use strict'

var fs = require('fs')

var langDir = __dirname + '/../languages'
var templateDir = __dirname + '/lua'
var languages = fs.readdirSync(langDir)
var templateFiles = fs.readdirSync(templateDir)

var valuesById = {}
templateFiles.forEach(function (templateFile) {
  var filedata = fs.readFileSync(templateDir + '/' + templateFile).toString()
  var lines = filedata.split('\n')
  var translationLines = []
  var lineValid = false
  lines.forEach(function (line) {
    line = line.trim()
    if (line.substr(0, 2) === '--' || line.length === 0) {
      return true
    }
    if (templateFile === 'text.lua') {
      if (line === 'local Global_Texts = {') {
        lineValid = true
        return true
      }
    }
    if (templateFile === 'text_achievements.lua') {
      if (line === 'Achievement_Texts = {') {
        lineValid = true
        return true
      }
    }
    if (templateFile === 'text_tooltips.lua') {
      if (line === 'TILE_TOOLTIPS = {' || line === 'local STATUS_TOOLTIPS = {' || line === 'local PilotSkills = {') {
        lineValid = true
      }
    }
    if (templateFile === 'text_population.lua') {
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
    if (templateFile === 'text.lua' || templateFile === 'text_achievements.lua') {
      var m = line.match(/^(.*?) = "(.*?)",($|[\s]*--)/i)
      values[m[1]] = m[2]
    }
    if (templateFile === 'text_tooltips.lua') {
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
    if (templateFile === 'text_population.lua') {
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
    valuesById[v].push(templateFile + '_' + k)
  }
})
var text = ['msgid ""', 'msgstr ""']
for (var msgid in valuesById) {
  text.push('msgctxt "' + valuesById[msgid].join(',') + '"')
  msgid = msgid.replace(/\n/g, '\\n')
  text.push('msgid "' + msgid + '"')
  text.push('msgstr "' + msgid + '"')
}
fs.writeFileSync(langDir + '/template.pot', text.join('\n'))
