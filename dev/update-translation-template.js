'use strict'

const fs = require('fs')
const luaparse = require('luaparse')
const shared = require(__dirname + '/shared')
const md5 = require('md5')

let translationKeys = {}
const addTranslation = function (str, file, context) {
  const hash = md5(str)
  if (typeof translationKeys[hash] === 'undefined') {
    translationKeys[hash] = {
      'text': str,
      'files': [],
      'contexts': []
    }
  }
  const o = translationKeys[hash]
  if (file && o.files.indexOf(file) === -1) o.files.push(file)
  if (context && o.contexts.indexOf(file) === -1) o.contexts.push(context)
};

// parse lua text* files
(function () {
  const files = shared.getLuaFiles(shared.config.gamesrc, '/scripts/text(\.|_)')
  const tableExpressionParse = function (data) {
    let ret = []
    if (data.type !== 'TableConstructorExpression') {
      return null
    }
    data.fields.forEach(function (field) {
      if (field.type === 'TableKeyString' || field.type === 'TableValue') {
        if (field.value.type === 'StringLiteral') {
          if (field.value.value.trim().length) {
            ret.push(field.value.value)
          }
        } else if (field.value.type === 'TableConstructorExpression') {
          const arr = tableExpressionParse(field.value)
          if (arr) {
            arr.forEach(function (value) {
              ret.push(value)
            })
          }
        }
      }
    })
    return ret
  }
  files.forEach(function (file) {
    const fileRelative = file.substr(shared.config.gamesrc.length + 1)
    const ast = luaparse.parse(fs.readFileSync(file).toString())
    ast.body.forEach(function (row) {
      const vars = row.variables ? row.variables[0] : null
      const init = row.init ? row.init[0] : null
      if (init && vars && vars.name.match(/Global_Texts|Achievement_Texts|TILE_TOOLTIPS|STATUS_TOOLTIPS|PilotSkills|PopEvent|Weapon_Texts/)) {
        tableExpressionParse(init).forEach(function (str) {
          addTranslation(str, fileRelative)
        })
      }
    })
  })
})();
// parse lua text* files
(function () {
  const files = shared.getLuaFiles(shared.config.gamesrc, '/scripts/text(\.|_)')
  const tableExpressionParse = function (data) {
    let ret = []
    if (data.type !== 'TableConstructorExpression') {
      return null
    }
    data.fields.forEach(function (field) {
      if (field.type === 'TableKeyString' || field.type === 'TableValue') {
        if (field.value.type === 'StringLiteral') {
          if (field.value.value.trim().length) {
            ret.push(field.value.value)
          }
        } else if (field.value.type === 'TableConstructorExpression') {
          const arr = tableExpressionParse(field.value)
          if (arr) {
            arr.forEach(function (value) {
              ret.push(value)
            })
          }
        }
      }
    })
    return ret
  }
  files.forEach(function (file) {
    const fileRelative = file.substr(shared.config.gamesrc.length + 1)
    const ast = luaparse.parse(fs.readFileSync(file).toString())
    ast.body.forEach(function (row) {
      const vars = row.variables ? row.variables[0] : null
      const init = row.init ? row.init[0] : null
      if (init && vars && vars.name.match(/Global_Texts|Achievement_Texts|TILE_TOOLTIPS|STATUS_TOOLTIPS|PilotSkills|PopEvent|Weapon_Texts/)) {
        tableExpressionParse(init).forEach(function (str) {
          addTranslation(str, fileRelative)
        })
      }
    })
  })
})();

// parse lua missions/* files
(function () {
  // manual added strings
  const arr = [
    ['Kill 4 enemies inflicted%%0with A.C.I.D.', {'regex': '"%s', 'replace': ['( |\\\\n)']}],
  ]
  arr.forEach(function (row) {
    addTranslation(row[0], null, row[1])
  })
  return
  const strings = [
    ['Kill 4 enemies inflicted with A.C.I.D.', '"%s'],
    ['Kill 4 enemies inflicted\\nwith A.C.I.D.', '"%s'],
    ['killed so far', '%s\\)"'],
    ['killed', '%s\\)"'],
    ['A.C.I.D. Tank', '"%s"'],
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
    ['Defend the 1st satellite launch', '"%s"'],
    ['Defend the 2nd satellite launch', '"%s"'],
    ['Satellite Rocket', '"%s"'],
    ['Defend the Tanks', '"%s'],
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
    ['Take less than 3 Grid Damage', '"%s"'],
    ['End battle with less than 4 Mech Damage', '"%s"'],
    ['Block Vek Spawning 3 times', '"%s"'],
    ['Enemies', '" *%s[\\\\ n]*"'],
    ['Your bonus objective', '"%s'],
    ['to defend this structure.', '%s"'],
    ['You withdrew from the battlefield, leaving supplies and civilians behind.', '"%s"'],
    ['All of your mechs have been disabled. An evacuation team will arrive shortly to recover your pilots and their wreckage.', '"%s"'],
    ['Current Damage:', '%s'],
    ['Current:', '%s'],
    ['Robotics Lab', '"%s"'],
    ['Old Earth Bar', '"%s"'],
    ['Corporate Tower', '"%s"'],
    ['Defense Lab', '"%s"'],
    ['Shield Generator', '"%s"'],
    ['Power Generator', '"%s"'],
    ['Emergency Batteries', '"%s"'],
    ['Airfield', '"%s"'],
    ['Rift Walkers', '"%s"'],
    ['Rusting Hulks', '"%s"'],
    ['Zenith Guard', '"%s"'],
    ['Steel Judoka', '"%s"'],
    ['Flame Behemoths', '"%s"'],
    ['Frozen Titans', '"%s"'],
    ['Hazardous Mechs', '"%s"'],
    ['Secret Squad', '"%s"'],
    ['Earn VAL or more Corporate Reputation.', '"%s"'],
    ['Lose VAL or less total Grid Power.', '"%s"'],
    ['Take VAL or less total Mech Damage', '"%s"'],
    ['Don\'t fail any Bonus Objective.', '"%s"'],
    ['Earn VAL Grid Power or more.', '"%s"'],
  ]
})()

// write template file
fs.writeFileSync(__dirname + '/../languages/template.json', JSON.stringify(translationKeys, null, 2))