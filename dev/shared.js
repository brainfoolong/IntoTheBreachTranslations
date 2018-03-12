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
  ],
  'pilotsTranslation': [
    'See below, this is the entry for a generic (A.I.) pilot.',
    'See below, this is the entry for a generic Archive pilot.',
    'See below, this is the entry for a generic R.S.T. pilot.',
    'See below, this is the entry for a generic Pinnacle (A.I.) pilot.',
    'See below, this is the entry for a generic Detritus pilot',
    'Ralph Karlsson [Unknown] Ralph has crossed the breach almost more times he can count - there\'s been at least a hundred timelines he\'s watched fall (in the opening state, he has yet to save even one). This continuous cycle of warfare has made him ruthlessly efficient, being unwilling to even sleep if he has to, as he feels every second counts... and every second that slips away could be the critical moment lost to the Vek. He\'s come a long way from the wide-eyed soldier he first was (it seems like several lifetimes ago, and it was), and he tries to avoid attachments to the other pilots, as he knows how likely they are to die in battle. He has never said which island he hails from, and there are suspicions he may have come from somewhere beyond the Corporate archipelago... possibly even from a space station. If true, Ralph has refused to confirm it, although in a few timelines, both Bethany, Harold, and Isaac have commented on the Time Pod\'s architecture as being modeled off of space-faring tech (notably a launch capsule of a rocket... or an escape pod of a rocket).',
    'Bethany Jones [Pinnacle] Bethany Jones served as a physics engineer at Pinnacle, helping design and refine Pinnacle shield technology. Having only grown up on Pinnacle, she\'s somewhat sheltered with regards to the other islands, and she tends to trusting of others, taking them at their word. She loves the cold and the snow, but she\'s also excited by the opportunities to see other islands in the Corporate archipelago and learn from the people there. While she and Isaac are technically brother and sister, there hasn\'t been a timeline where they both were alive to realize this (either Bethany dies at a young age, or Isaac dies - only one of them could be saved in the womb b/c of a chronic medical condition their parents had). Bethany has had a more positive upbringing than Isaac, and her genius is tempered more with empathy and optimism than Isaac (who had a much more difficult childhood).',
    'Abe Isamu [R.S.T.] Sometimes jokingly called ""Honest Abe"" in previous timelines, nothing could be farther from the truth. Abe served as an ""expeditor"" (assassin and ""black box"" work) during the early years of CEO Kern\'s rise to power, and he took on many names and identities in service to R.S.T. to handle any ""difficult issues"" that would arise that needed to be dealt with by the corporation. He is ruthless when given an objective (in this case, fighting the Vek), and served as ground support in his original timeline before stealing a Mech from a dying (?) pilot and using its breach technology to escape the timeline after the squad perished in the volcanic island. Since then, ""Abe"" has followed the orders of his first CEO Kern and is determined to keep fighting until every Vek in every timeline is defeated... a hopeless task, but ""Abe"" realizes he has little else to fight for, and even if he were to remain in a timeline he saved, he could not deal with the idea that other timelines were still in jeopardy. He has yet to encounter his duplicate, and if so, he may not recognize them due to surgery and the fluctuation of identities his job required before the Vek attack.',
    'Harold Schmidt [Archive] Harold is as close as they come to an engineering ""sociopath"" (this is not the clinical term - co-workers in previous timelines used to call him a ""technopath,"" but even that\'s not an accurate term for his lack of empathy and social skills). He finds humans uncomfortable and confusing, and takes solace in tinkering with robotics and machines who have clear rulesets and reasons for what they do. In his original timeline, he served a brief term at Detritus (where he seemed bored and uncommunicative), then was rejected from Pinnacle due to his psychological exam, then found a home in Archive, studying and doing restoration work on Old Earth robotics. He initially applied to Archive\'s open-call for pilot training so it could get him closer to the Mech technology, then it was discovered he did well on the pilot exam (better than most Archive volunteers), and he agreed to serve as a soldier as a way of giving him access to the cutting edge of Mech technology. (Note that Harold doesn\'t bear any ill-will toward Detritus and Pinnacle, nor do they bear him any ill-will... however, both Singh\'s predecessor and Zenith saw Harold\'s lack of empathy, and were worried it could lead to accidents or disregard for human life while he was carrying out his duties.)',
    'Prospero [Detritus] In its original timeline, Prospero was a recycler robot from Detritus. Its job was to monitor region safety in Detritus disposal sites, but was severely damaged in a disposal accident (this was in the days before Vikram was CEO). The ""recycled recycler"" robot was sold at a discount to Archive as a groundskeeper for some of the nature preserves, and it seemed to take to the work, translating its knowledge of chemistry and recycling technology to help cultivate gardens (and when it wasn\'t able to do this, it would devour all books on botany, biology, and even spiritual books related to nurturing and growing of all life forms). It would have likely have remained a quiet hulking gardener were it not for the emergence of the Vek. When the Vek erupted on Archive, the robot followed its directives to protect the nature preserves… and saw the Vek as nothing more than garden pests to be eliminated to protect the plants. When Archive was able to send reinforcements to the region, they found Prospero still quietly tending its garden, now fertilized with Vek corpses.',
  ],
  'additionalTranslationFiles': {
    /*'scripts/missions/acid/mission_acidtank.lua': {
      0: {'text': 'Kill 4 enemies inflicted with A.C.I.D.', 'lines': [4, 18]},
    },*/
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