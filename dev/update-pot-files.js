'use strict'

var fs = require('fs')

var langDir = __dirname + '/../languages'
var templateDir = __dirname + '/lua'
var languages = fs.readdirSync(langDir)
var templateFiles = fs.readdirSync(templateDir)

templateFiles.forEach(function (value) {
  var filedata = fs.readFileSync(templateDir + '/' + value).toString()
  var lines = filedata.split('\n')
  var translationLines = []
  var lineValid = false
  lines.forEach(function (line) {
    line = line.trim()
    if (line.substr(0, 2) === '--' || line.length === 0) {
      return true
    }
    if (value === 'text.lua') {
      if (line === 'local Global_Texts = {') {
        lineValid = true
        return true
      }
    }
    if (value === 'text_achievements.lua') {
      if (line === 'Achievement_Texts = {') {
        lineValid = true
        return true
      }
    }
    if (value === 'text_tooltips.lua') {
      if (line === 'TILE_TOOLTIPS = {') {
        lineValid = true
        return true
      }
    }
    if (value === 'text_population.lua') {
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
  translationLines.forEach(function (line) {
    if (value === 'text.lua' || value === 'text_achievements.lua') {
      var m = line.match(/^(.*?) = "(.*?)",($|[\s]*--)/i)
      if (!m) {
        console.log(line)
      }
      values[m[1]] = m[2]
    }
    if (value === 'text_tooltips.lua' || value === 'text_population.lua') {
      line = line.replace(/, Odds = 50 /ig, '')
      var m = line.match(/^(.*?) = \{(.*?)\},($|[\s]*--)/i)
      var o = JSON.parse('[' + m[2].replace(/[\s,]*$/ig, '') + ']')
      for (var i in o) {
        values[m[1] + '_' + i] = o[i]
      }
    }
  })

})
