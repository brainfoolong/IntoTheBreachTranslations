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
    ['Destroy %%0 Goos', {'regex': '"%s', 'replace': ['"..self.BlobDeaths.."']}],
    ['killed so far', {'regex': '%s'}],
    ['A.C.I.D. Tank', {'regex': '"%s"'}],
    ['Destroy the A.C.I.D. Vats', {'regex': '"%s"'}],
    ['Destroy the Vats', {'regex': '"%s"'}],
    ['Remain', {'regex': '"%s"'}],
    ['Conveyors', {'regex': '"%s"'}],
    ['Conveyor Belts will push any unit on them in the marked direction at the start of the enemy turn.', {'regex': '"%s"'}],
    ['CONVEYOR BELTS', {'regex': '"%s"'}],
    ['CONVEYORS', {'regex': '"%s"'}],
    ['Defend the Disposal Unit', {'regex': '"%s"'}],
    ['Destroy all mountains', {'regex': '"%s"'}],
    ['Mountains', {'regex': '"%s"'}],
    ['Disposal', {'regex': '"%s"'}],
    ['A.C.I.D. Launcher', {'regex': '"%s"'}],
    ['Partial', {'regex': '"%s"'}],
    ['Air Support', {'regex': '"%s"'}],
    ['Bombs will be dropped on the marked spaces, killing any unit.', {'regex': '"%s"'}],
    ['AIR SUPPORT', {'regex': '"%s"'}],
    ['Destroy the Beetle Leader', {'regex': '"%s"'}],
    ['Destroy the Bot Leader', {'regex': '"%s"'}],
    ['Destroy the Firefly Leader', {'regex': '"%s"'}],
    ['Destroy 5 Goos', {'regex': '"%s"'}],
    ['Destroy', {'regex': '"%s *"'}],
    ['Large Goo', {'regex': '"%s"'}],
    ['Medium Goo', {'regex': '"%s"'}],
    ['Small Goo', {'regex': '"%s"'}],
    ['Destroy the Hornet Leader', {'regex': '"%s"'}],
    ['Hornet Leader', {'regex': '"%s"'}],
    ['Destroy the Psion Abomination', {'regex': '"%s"'}],
    ['Psion Abomination', {'regex': '"%s"'}],
    ['Destroy the Scorpion Leader', {'regex': '"%s"'}],
    ['Scorpion Leader', {'regex': '"%s"'}],
    ['Destroy the Slug Leader', {'regex': '"%s"'}],
    ['Hive Leader', {'regex': '"%s"'}],
    ['Slugling Egg', {'regex': '"%s"'}],
    ['Destroy the Spider Leader', {'regex': '"%s"'}],
    ['Spider Leader', {'regex': '"%s"'}],
    ['Spiderling Egg', {'regex': '"%s"'}],
    ['Caverns', {'regex': '"%s"'}],
    ['Watch out for falling rocks and lava!', {'regex': '"%s"'}],
    ['Volcano', {'regex': '"%s"'}],
    ['Watch out for the active volcano!', {'regex': '"%s"'}],
    ['VOLCANO', {'regex': '"%s"'}],
    ['Survive the Fight', {'regex': '"%s"'}],
    ['Defend the Renfield Bomb until it explodes', {'regex': '"%s"'}],
    ['Renfield Bomb', {'regex': '"%s"'}],
    ['Defend the Artillery Support', {'regex': '"%s"'}],
    ['Defend the Artillery Unit', {'regex': '"%s"'}],
    ['Old Artillery', {'regex': '"%s"'}],
    ['Destroy the dam', {'regex': '"%s"'}],
    ['Old Earth Dam', {'regex': '"%s"'}],
    ['Defend the Satellite Launches', {'regex': '"%s *"'}],
    ['(One Lost)', {'regex': '"%s"'}],
    ['Defend the 1st satellite launch', {'regex': '"%s"'}],
    ['Defend the 2nd satellite launch', {'regex': '"%s"'}],
    ['Satellite Rocket', {'regex': '"%s"'}],
    ['Defend the Tanks', {'regex': '"%s'}],
    ['Defend Archive Inc. Tanks (One Lost)', {'regex': '"%s"'}],
    ['undamaged', {'regex': '%s\\)"'}],
    ['Archive Tank', {'regex': '"%s"'}],
    ['Archive Inc \\nOld Earth Tank', {'regex': '"%s"'}],
    ['High Tides', {'regex': '"%s"'}],
    ['Marked tiles will turn to water at the start of the enemy turn.', {'regex': '"%s"'}],
    ['TIDAL WAVES', {'regex': '"%s"'}],
    ['Defend the Prototype Renfield Bombs', {'regex': '"%s *"'}],
    ['Defend the Bombs', {'regex': '"%s(\\n)*"'}],
    ['Prototype Bomb', {'regex': '"%s"'}],
    ['Cataclysmic Earthquakes', {'regex': '"%s"'}],
    ['Marked tiles will become Chasms at the start of the enemy turn, killing any ground units present.', {'regex': '"%s"'}],
    ['CATACLYSM', {'regex': '"%s"'}],
    ['Seismic Activity', {'regex': '"%s"'}],
    ['Marked squares will sink into the earth, killing anything on them.', {'regex': '"%s"'}],
    ['Defend the Earth Mover', {'regex': '"%s"'}],
    ['Earth Mover', {'regex': '"%s"'}],
    ['Destroy 2 mountains', {'regex': '"%s"'}],
    ['Destroy 2 mountains \\n(Current: ', {'regex': '"%s"'}],
    ['Sinkhole Hive', {'regex': '"%s"'}],
    ['Lightning Storm', {'regex': '"%s"'}],
    ['Lightning will strike four spaces every turn, killing any unit on the marked tiles.', {'regex': '"%s"'}],
    ['LIGHTNING STORM', {'regex': '"%s"'}],
    ['LIGHTNING', {'regex': '"%s"'}],
    ['Sandstorm', {'regex': '"%s"'}],
    ['All DUNES will turn to SMOKE, all SMOKE will be removed.', {'regex': '"%s"'}],
    ['SANDSTORM', {'regex': '"%s"'}],
    ['Defend the Terraformer', {'regex': '"%s"'}],
    ['Terraform the grassland back to desert', {'regex': '"%s"'}],
    ['Area Blast', {'regex': '"%s"'}],
    ['Self-Destruct, damaging neighboring tiles.', {'regex': '"%s"'}],
    ['Defend the Robots', {'regex': '"%s *"'}],
    ['Defend the remaining Robot', {'regex': '"%s"'}],
    ['Robot Factories', {'regex': '"%s"'}],
    ['Robot Factory', {'regex': '"%s"'}],
    ['Defend both Robot Factories', {'regex': '"%s"'}],
    ['damaged', {'regex': '%s\\)"'}],
    ['Break 5 buildings out of the ice', {'regex': '"%s'}],
    ['Break 5 buildings out\\nof the ice', {'regex': '"%s'}],
    ['Freeze and defend both robots', {'regex': '"%s"'}],
    ['Freeze and defend the robots (one frozen)', {'regex': '"%s"'}],
    ['Freeze and defend \\nboth robots', {'regex': '"%s"'}],
    ['Freeze and defend the remaining robot', {'regex': '"%s"'}],
    ['Ice Storm', {'regex': '"%s"'}],
    ['Marked tiles will be frozen at the start of the enemy turn.', {'regex': '"%s"'}],
    ['ICE STORM', {'regex': '"%s"'}],
    ['Freeze Tank', {'regex': '"%s"'}],
    ['Freeze Cannon', {'regex': '"%s"'}],
    ['Shoot a projectile that freezes targets', {'regex': '"%s"'}],
    ['Solar Farm', {'regex': '"%s"'}],
    ['Solar Farms', {'regex': '"%s"'}],
    ['Defend both Solar Farms', {'regex': '"%s"'}],
    ['Defend both Wind Farms', {'regex': '"%s"'}],
    ['Defend both Power Plants', {'regex': '"%s"'}],
    ['Your bonus objective', {'regex': '"%s *"'}],
    ['to defend this structure', {'regex': ' *%s("|\.)'}],
    ['Defend the train', {'regex': '"%s'}],
    ['Defend the damaged train', {'regex': '"%s"'}],
    ['The train is damaged and will no longer move', {'regex': '"%s"'}],
    ['If the train is blocked when moving, it will explode', {'regex': '"%s"'}],
    ['It is too damaged to continue. Defend it.', {'regex': '"%s"'}],
    ['Supply Train', {'regex': '"%s"'}],
    ['Damaged Train', {'regex': '"%s"'}],
    ['Move forward 2 spaces, but will be destroyed if blocked.', {'regex': '"%s"'}],
    ['Kill all enemies before they retreat', {'regex': '"%s"'}],
    ['Kill all enemies before \\nthey retreat', {'regex': '"%s"'}],
    ['Do not kill the Volatile Vek', {'regex': '"%s"'}],
    ['Don\'t let the Volatile \\nVek die', {'regex': '"%s"'}],
    ['Volatile Vek', {'regex': '"%s"'}],
    ['This is a CEO mission briefing message. It is very atmospheric and exciting, giving you a closer look at the world and the mission you\'re about to engage in.', {'regex': '"%s"'}],
    ['This is a CEO mission closing message. It reflects on how well the mission just went. It has glowing praise, or possibly it\'s rather insulting of your skills.', {'regex': '"%s"'}],
    ['Kill all enemies before \\nthey retreat', {'regex': '"%s"'}],
    ['Less than 3 Grid Damage', {'regex': '"%s'}],
    ['End with less than 4 Mech Damage', {'regex': '"%s'}],
    ['Block Vek Spawning 3 times', {'regex': '"%s'}],
    ['Block Vek Spawning\\n3 times', {'regex': '"%s'}],
    ['Kill at least', {'regex': '"%s *"'}],
    ['Protect the', {'regex': '"%s *"'}],
    ['Do not kill the Volatile Vek', {'regex': '"%s"'}],
    ['Take less than 3 Grid Damage', {'regex': '"%s"'}],
    ['End battle with less than 4 Mech Damage', {'regex': '"%s"'}],
    ['Block Vek Spawning 3 times', {'regex': '"%s"'}],
    ['Enemies', {'regex': '" *%s[\\\\ n]*"'}],
    ['Your bonus objective', {'regex': '"%s'}],
    ['to defend this structure.', {'regex': '%s"'}],
    ['You withdrew from the battlefield, leaving supplies and civilians behind.', {'regex': '"%s"'}],
    ['All of your mechs have been disabled. An evacuation team will arrive shortly to recover your pilots and their wreckage.', {'regex': '"%s"'}],
    ['Current Damage:', {'regex': '%s'}],
    ['Current:', {'regex': '%s'}],
    ['Robotics Lab', {'regex': '"%s"'}],
    ['Old Earth Bar', {'regex': '"%s"'}],
    ['Corporate Tower', {'regex': '"%s"'}],
    ['Defense Lab', {'regex': '"%s"'}],
    ['Shield Generator', {'regex': '"%s"'}],
    ['Power Generator', {'regex': '"%s"'}],
    ['Emergency Batteries', {'regex': '"%s"'}],
    ['Airfield', {'regex': '"%s"'}],
    ['Rift Walkers', {'regex': '"%s"'}],
    ['Rusting Hulks', {'regex': '"%s"'}],
    ['Zenith Guard', {'regex': '"%s"'}],
    ['Steel Judoka', {'regex': '"%s"'}],
    ['Flame Behemoths', {'regex': '"%s"'}],
    ['Frozen Titans', {'regex': '"%s"'}],
    ['Hazardous Mechs', {'regex': '"%s"'}],
    ['Secret Squad', {'regex': '"%s"'}],
    ['Earn VAL or more Corporate Reputation.', {'regex': '"%s"'}],
    ['Lose VAL or less total Grid Power.', {'regex': '"%s"'}],
    ['Take VAL or less total Mech Damage', {'regex': '"%s"'}],
    ['Don\'t fail any Bonus Objective.', {'regex': '"%s"'}],
    ['Earn VAL Grid Power or more.', {'regex': '"%s"'}]
  ]
  arr.forEach(function (row) {
    addTranslation(row[0], null, row[1])
  })
})()

// write template file
fs.writeFileSync(__dirname + '/../languages/template.json', JSON.stringify(translationKeys, null, 2))