'use strict'
const fs = require('fs')

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
  'additionalTranslations': [
    ['Kill 4 enemies inflicted with A.C.I.D.', '"%s"'],
    ['Kill 4 enemies inflicted\\nwith A.C.I.D.', '"%s"'],
    ['killed so far', '%s\\)"'],
    ['killed', '%s\\)"'],
    ['A.C.I.D. Tank', '"%s"'],
    ['Success', '"%s"'],
    ['Failure', '"%s"'],
    ['Destroy the A.C.I.D. Vats', '"%s"'],
    ['Destroy the Vats', '"%s"'],
    ['Remain', '"%s"'],
    ['Conveyors', '"%s"'],
    ['Conveyor Belts will push any unit on them in the marked direction at the start of the enemy turn.', '"%s"'],
    ['CONVEYOR BELTS', '"%s"'],
    ['CONVEYORS', '"%s"'],
    ['Defend the Disposal Unit', '"%s"'],
    ['Destroy all mountains', '"%s"'],
    ['Mountains', '"%s"'],
    ['Disposal', '"%s"'],
    ['A.C.I.D. Launcher', '"%s"']
  ],
  '__additionalTranslationFiles': {
    'scripts/missions/acid/mission_acidtank.lua': {
      0: {'text': 'Kill 4 enemies inflicted with A.C.I.D.', 'lines': [4, 18]},
      1: {'text': 'Kill 4 enemies inflicted\\nwith A.C.I.D.', 'lines': [34]},
      2: {'text': 'killed', 'lines': [18, 34]},
      3: {'text': 'A.C.I.D. Tank', 'lines': [44]},
      4: {'text': 'Success', 'lines': [26]},
      5: {'text': 'Failure', 'lines': [28]},
    },
    'scripts/missions/acid/mission_barrels.lua': {
      0: {'text': 'Destroy the A.C.I.D. Vats', 'lines': [6, 59]},
      1: {'text': 'Success', 'lines': [42]},
      2: {'text': 'Failure', 'lines': [40]},
      3: {'text': 'Destroy the Vats', 'lines': [51]},
      4: {'text': 'Remain', 'lines': [51]}
    },
    'scripts/missions/acid/mission_belt.lua': {
      0: {'text': 'Conveyors', 'lines': [14]},
      1: {
        'text': 'Conveyor Belts will push any unit on them in the marked direction at the start of the enemy turn.',
        'lines': [15]
      },
      2: {'text': 'CONVEYOR BELTS', 'lines': [16]},
      3: {'text': 'CONVEYORS', 'lines': [18]},
    },
    'scripts/missions/acid/mission_disposal.lua': {
      0: {'text': 'Defend the Disposal Unit', 'lines': [4, 41]},
      1: {'text': 'Destroy all mountains', 'lines': [4, 42]},
      2: {'text': 'Failure', 'lines': [50]},
      3: {'text': 'Mountains', 'lines': [52]},
      4: {'text': 'Disposal', 'lines': [54]},
      5: {'text': 'Success', 'lines': [56]},
      6: {'text': 'A.C.I.D. Launcher', 'lines': [68]}
    }
  }
}

shared.getAllOtherLuaFiles = function (dir, out) {
  const files = fs.readdirSync(dir)
  files.forEach(function (file) {
    let path = dir + '/' + file
    if (path.match(/\/text\.lua|\/text_.*?\.lua/)) {
      return
    }
    if (fs.lstatSync(path).isDirectory()) {
      shared.getAllOtherLuaFiles(path, out)
    } else if (file.substr(-4) === '.lua') {
      out.push(path)
    }
  })
  return out
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