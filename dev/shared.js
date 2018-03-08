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
    ['Kill 4 enemies inflicted with A.C.I.D.', '"%s'],
    ['Kill 4 enemies inflicted\\nwith A.C.I.D.', '"%s'],
    ['killed so far', '%s\\)"'],
    ['killed', '%s\\)"'],
    ['A.C.I.D. Tank', '"%s"'],
    null,
    null,
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
    ['A.C.I.D. Launcher', '"%s"'],
    ['Partial', '"%s"'],
    ['Air Support', '"%s"'],
    ['Bombs will be dropped on the marked spaces, killing any unit.', '"%s"'],
    ['AIR SUPPORT', '"%s"'],
    ['Destroy the Beetle Leader', '"%s"'],
    ['Destroy the Bot Leader', '"%s"'],
    ['Destroy the Firefly Leader', '"%s"'],
    ['Destroy 5 Goos', '"%s"'],
    ['Destroy', '"%s *"'],
    ['Large Goo', '"%s"'],
    ['Medium Goo', '"%s"'],
    ['Small Goo', '"%s"'],
    ['Destroy the Hornet Leader', '"%s"'],
    ['Hornet Leader', '"%s"'],
    ['Destroy the Psion Abomination', '"%s"'],
    ['Psion Abomination', '"%s"'],
    ['Destroy the Scorpion Leader', '"%s"'],
    ['Scorpion Leader', '"%s"'],
    ['Destroy the Slug Leader', '"%s"'],
    ['Hive Leader', '"%s"'],
    ['Slugling Egg', '"%s"'],
    ['Destroy the Spider Leader', '"%s"'],
    ['Spider Leader', '"%s"'],
    ['Spiderling Egg', '"%s"'],
    ['Caverns', '"%s"'],
    ['Watch out for falling rocks and lava!', '"%s"'],
    ['Volcano', '"%s"'],
    ['Watch out for the active volcano!', '"%s"'],
    ['VOLCANO', '"%s"'],
    ['Survive the Fight', '"%s"'],
    ['Defend the Renfield Bomb until it explodes', '"%s"'],
    ['Renfield Bomb', '"%s"'],
    ['Defend the Artillery Support', '"%s"'],
    ['Defend the Artillery Unit', '"%s"'],
    ['Old Artillery', '"%s"'],
    ['Destroy the dam', '"%s"'],
    ['Old Earth Dam', '"%s"'],
    ['Defend the Satellite Launches', '"%s *"'],
    ['(One Lost)', '"%s"'],
    ['Defend the 1st\\nsatellite launch" or "Defend the 1st satellite launch', '"%s"'],
    ['Defend the 2nd\\nsatellite launch" or "Defend the 2nd satellite launch', '"%s"'],
    ['Satellite Rocket', '"%s"'],
    ['Defend the Tanks', '"%s(\\n)*"'],
    ['Defend Archive Inc. Tanks (One Lost)', '"%s"'],
    ['undamaged', '%s\\)"'],
    ['Archive Tank', '"%s"'],
    ['Archive Inc \\nOld Earth Tank', '"%s"'],
    ['High Tides', '"%s"'],
    ['Marked tiles will turn to water at the start of the enemy turn.', '"%s"'],
    ['TIDAL WAVES', '"%s"'],
    ['Defend the Prototype Renfield Bombs', '"%s *"'],
    ['Defend the Bombs', '"%s(\\n)*"'],
    ['Prototype Bomb', '"%s"'],
    ['Cataclysmic Earthquakes', '"%s"'],
    ['Marked tiles will become Chasms at the start of the enemy turn, killing any ground units present.', '"%s"'],
    ['CATACLYSM', '"%s"'],
    ['Seismic Activityo', '"%s"'],
    ['Marked squares will sink into the earth, killing anything on them.', '"%s"'],
    ['Defend the Earth Mover', '"%s"'],
    ['Earth Mover', '"%s"'],
    ['Destroy 2 mountains', '"%s"'],
    ['Destroy 2 mountains \\n(Current: ', '"%s"'],
    ['Sinkhole Hive', '"%s"'],
    ['Lightning Storm', '"%s"'],
    ['Lightning will strike four spaces every turn, killing any unit on the marked tiles.', '"%s"'],
    ['LIGHTNING STORM', '"%s"'],
    ['LIGHTNING', '"%s"'],
    ['Sandstorm', '"%s"'],
    ['All DUNES will turn to SMOKE, all SMOKE will be removed.', '"%s"'],
    ['SANDSTORM', '"%s"'],
    ['Defend the Terraformer', '"%s"'],
    ['Terraform the grassland back to desert', '"%s"'],
    ['Area Blast', '"%s"'],
    ['Self-Destruct, damaging neighboring tiles.', '"%s"'],
    ['Defend the Robots', '"%s *"'],
    ['Defend the remaining Robot', '"%s"'],
    ['Robot Factories', '"%s"'],
    ['Robot Factory', '"%s"'],
    ['Defend both Robot Factories', '"%s"'],
    ['damaged', '%s\\)"'],
    ['Break 5 buildings out of the ice', '"%s'],
    ['Break 5 buildings out\\nof the ice', '"%s'],
    ['Freeze and defend both robots', '"%s"'],
    ['Freeze and defend the robots (one frozen)', '"%s"'],
    ['Freeze and defend \\nboth robots', '"%s"'],
    ['Freeze and defend the remaining robot', '"%s"'],
    ['Ice Storm', '"%s"'],
    ['Marked tiles will be frozen at the start of the enemy turn.', '"%s"'],
    ['ICE STORM', '"%s"'],
    ['Freeze Tank', '"%s"'],
    ['Freeze Cannon', '"%s"'],
    ['Shoot a projectile that freezes targets', '"%s"'],
    ['Solar Farm', '"%s"'],
    ['Solar Farms', '"%s"'],
    ['Defend both Solar Farms', '"%s"'],
    ['Defend both Wind Farms', '"%s"'],
    ['Defend both Power Plants', '"%s"'],
    ['Your bonus objective', '"%s *"'],
    ['to defend this structure', ' *%s("|\.)'],
    ['Defend the train', '"%s'],
    ['Defend the damaged train', '"%s"'],
    ['The train is damaged and will no longer move', '"%s"'],
    ['If the train is blocked when moving, it will explode', '"%s"'],
    ['It is too damaged to continue. Defend it.', '"%s"'],
    ['Supply Train', '"%s"'],
    ['Damaged Train', '"%s"'],
    ['Move forward 2 spaces, but will be destroyed if blocked.', '"%s"'],
    ['Kill all enemies before they retreat', '"%s"'],
    ['Kill all enemies before \\nthey retreat', '"%s"'],
    ['Do not kill the Volatile Vek', '"%s"'],
    ['Don\'t let the Volatile \\nVek die', '"%s"'],
    ['Volatile Vek', '"%s"'],
    ['This is a CEO mission briefing message. It is very atmospheric and exciting, giving you a closer look at the world and the mission you\'re about to engage in.', '"%s"'],
    ['This is a CEO mission closing message. It reflects on how well the mission just went. It has glowing praise, or possibly it\'s rather insulting of your skills.', '"%s"'],
    ['Kill all enemies before \\nthey retreat', '"%s"'],
    ['Less than 3 Grid Damage', '"%s'],
    ['End with less than 4 Mech Damage', '"%s'],
    ['Block Vek Spawning 3 times', '"%s'],
    ['Block Vek Spawning\\n3 times', '"%s'],
    ['Kill at least', '"%s *"'],
    ['Protect the', '"%s *"'],
    ['Do not kill the Volatile Vek', '"%s"'],
    ['Take less than 3 Grid Damag', '"%s"'],
    ['End battle with less than 4 Mech Damage', '"%s"'],
    ['Block Vek Spawning 3 times', '"%s"'],
    ['Enemies', '" *%s *"'],
    ['Your bonus objective', '"%s'],
    ['to defend this structure.', '%s"'],
    ['You withdrew from the battlefield, leaving supplies and civilians behind.', '"%s"'],
    ['All of your mechs have been disabled. An evacuation team will arrive shortly to recover your pilots and their wreckage.', '"%s"'],
    ['Protect the', '"%s"'],
    ['Protect the', '"%s"'],
    ['Protect the', '"%s"'],
    ['Protect the', '"%s"'],
    ['Protect the', '"%s"'],
    ['Protect the', '"%s"'],
    ['Protect the', '"%s"'],
    ['Protect the', '"%s"'],
    ['Protect the', '"%s"'],


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