'use strict'
const shared = {
  'config': require(__dirname + '/config'),
  'translationFiles': ['scripts/text.lua', 'scripts/text_achievements.lua', 'scripts/text_tooltips.lua', 'scripts/text_population.lua', 'scripts/text_weapons.lua'],
  'contexts': {
    'TILE_TOOLTIPS = {': 'TILE_TOOLTIPS',
    'local STATUS_TOOLTIPS = {': 'STATUS_TOOLTIPS',
    'local PilotSkills = {': 'PilotSkills',
    'local PopEvent = {': 'PopEvent',
    'Achievement_Texts = {': 'Achievement_Texts',
    'local Global_Texts = {': 'Global_Texts',
    'Weapon_Texts = {': 'Weapon_Texts'
  },
  'additionalTranslationFiles': {
    'scripts/missions/acid/mission_acidtank.lua': {
      0: {'text': 'Kill 4 enemies inflicted with A.C.I.D.', 'lines': [4, 18]},
      1: {'text': 'Kill 4 enemies inflicted\\nwith A.C.I.D.', 'lines': [34]},
      2: {'text': 'killed', 'lines': [18, 34]},
      3:{'text' : 'A.C.I.D. Tank', 'lines': [44]},
      4:{'text' : 'Success', 'lines': [26]},
      5:{'text' : 'Failure', 'lines': [28]},
    }
  }
}

shared.escapeRegex = function (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}

shared.getLineContext = function (lineTrimmed, currentContext) {
  let context = currentContext
  if (typeof shared.contexts[lineTrimmed] !== 'undefined') {
    context = shared.contexts[lineTrimmed]
  }
  if (lineTrimmed === '}' && context !== null) {
    context = null
  }
  return context
}
/**
 * Parse po file
 * @param {[]} lines
 * @param {=bool} flat
 * @return {object}
 */
shared.parsePoFile = function (lines, flat) {
  let currentId = null
  let msgData = {}
  let translations = {}
  lines.forEach(function (line, lineNr) {
    line = line.trim()
    let contextMatch = line.match(/^(msg[a-z]+)/, line)
    if (contextMatch) {
      line = line.substr(contextMatch[1].length + 1)
      if (contextMatch[1] === 'msgctxt') {
        msgData = {'key': lineNr}
      }
      currentId = contextMatch[1]
    }
    if (line.substr(0, 1) === '"' && currentId !== null) {
      if (typeof msgData[currentId] === 'undefined') {
        msgData[currentId] = {'lines': [], 'text': []}
      }
      let v = line.substring(1, line.length - 1)
      msgData[currentId].lines.push(lineNr)
      if (v.length) {
        msgData[currentId].text.push(v)
      }
    }
    if (typeof msgData.key !== 'undefined') {
      let o = msgData
      if (flat) {
        o = {}
        for (let i in msgData) {
          if (i === 'key') continue
          o[i] = typeof msgData[i].text !== 'undefined' ? msgData[i].text.join('') : null
        }
      }
      if (o.msgctxt) {
        translations[msgData.key] = o
      }
    }
  })
  return translations
}
module.exports = shared